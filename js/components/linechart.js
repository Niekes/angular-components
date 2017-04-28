'use strict';

app.component('linechart', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$linechartCtrl',
	controller: function($element, DEFAULTS){

		var c = d3.scaleOrdinal(d3.schemeDark2);
		var parseTime = d3.timeParse('%Y%m%d');
		var tt = DEFAULTS.TRANSITION.TIME;
		var $linechartCtrl = this;
		var el = $element[0];
		var req = ['data/berlin-weather.csv'];
		var xScale2;
		var xScale;
		var height;
		var height2;
		var width;
		var lines;
		var lines2;
		var xAxis;
		var line;
		var line2;
		var zoom;
		var brush;
		var context;
		var svg;

		$linechartCtrl.init = function(){

			Promise.all(req.map(function(url){
					return fetch(url).then(function(response){
						return response.ok ? response.text() : Promise.reject(response.status);
				}).then(function(text) {
					return d3.dsvFormat(';').parse(text).map(function(row){
						return {
							date: parseTime(row.MESS_DATUM),
							temperature: parseInt(row.LUFTTEMPERATUR),
						};
					});
				});
			})).then(function(data){

				angular.element(el).empty();

				var margin = {top: 20, right: 20, bottom: 120, left: 30};
				var margin2 = {top: 320, right: 20, bottom: 20, left: 30};

				width = el.clientWidth - margin.left - margin.right;
				height = el.clientHeight - margin.top - margin.bottom;
				height2 = el.clientHeight - margin2.top - margin2.bottom;

	    		svg = d3.select(el).append('svg')
					.attr('width', width + margin.left + margin.right)
					.attr('height', height + margin.top + margin.bottom)
					.append('g')
						.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
				svg
					.append('g')
					.attr('class', 'lines');

				svg.append('g')
					.attr('opacity', 0)
					.attr('class', 'axis x justText')
					.attr('transform', 'translate(0,' + height + ')');

				svg.append('g')
					.attr('opacity', 0)
					.attr('class', 'axis y');

				svg.append('defs').append('clipPath')
					.attr('id', 'clip')
					.append('rect')
					.attr('width', width)
					.attr('height', height);

				brush = d3.brushX()
    				.extent([[0, 0], [width, height2]])
    				.on('brush end', brushed);

				zoom = d3.zoom()
					.scaleExtent([1, Infinity])
					.translateExtent([[0, 0], [width, height]])
					.extent([[0, 0], [width, height]])
					.on('zoom', zoomed);

				d3.select(el).select('svg').append('rect')
					.attr('class', 'zoom')
					.attr('width', width)
					.attr('height', height)
					.style('fill', 'none')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
					.call(zoom);

				context = d3.select(el).select('svg').append('g')
				    .attr('class', 'context')
    				.attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

				context
					.append('g')
					.attr('class', 'axis x2')
					.attr('opacity', 0)
					.attr('transform', 'translate(0,' + height2 + ')');

				xScale = d3.scaleTime()
					.domain([parseTime('19480101'), parseTime('20151201')])
					.range([0, width]);

				xScale2 = d3.scaleTime()
					.domain(xScale.domain())
					.range([0, width]);

				xAxis = d3.axisBottom(xScale);

				context.append('g')
      				.attr('class', 'brush')
      				.call(brush)
      				.call(brush.move, xScale.range());

				$linechartCtrl.update(el, [{key: 'Berlin', values: data[0]}]);
			});

		};

		function brushed(){
			if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom'){
				return;
			}
			var s = d3.event.selection || xScale2.range();
			xScale.domain(s.map(xScale2.invert, xScale2));
			svg.select('g.lines').selectAll('path.line').attr('d', function(d) { return line(d.values); });
			svg.select('g.x.axis').call(xAxis);
			svg.select('g.zoom').call(zoom.transform, d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0));
		}

		function zoomed(){
			if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush'){
				return;
			}
			var t = d3.event.transform;
			xScale.domain(t.rescaleX(xScale2).domain());
			svg.select('g.lines').selectAll('path.line').attr('d', function(d) { return line(d.values); });
			svg.select('g.x.axis').call(xAxis);
			context.select('g.brush').call(brush.move, xScale.range().map(t.invertX, t));
		}

		$linechartCtrl.update = function(el, data){

			var yMin = d3.min(data, function(d) { return d3.min(d.values, function(d) { return d.temperature; }); });
			var yMax = d3.max(data, function(d) { return d3.max(d.values, function(d) { return d.temperature; }); });

			var yScale = d3.scaleLinear()
			    .domain([-20, 40])
			    .range([height, 0])
			    .nice();

			var yScale2 = d3.scaleLinear()
			    .domain(yScale.domain())
			    .range([height2, 0])
			    .nice();

		    var yAxis = d3.axisLeft(yScale).ticks(4);
		   	var xAxis2 = d3.axisBottom(xScale2);

		    svg.select('g.x.axis').transition().duration(tt).attr('opacity', 1).call(xAxis);
		    svg.select('g.y.axis').transition().duration(tt).attr('opacity', 1).call(yAxis);
		    d3.select(el).select('svg').select('g.context').transition().duration(tt).attr('opacity', 1).call(xAxis2);

			line = d3.line()
	    		.curve(d3.curveLinear)
	    		.x(function(d) { return xScale(d.date); })
	    		.y(function(d) { return yScale(d.temperature); });

			line2 = d3.line()
	    		.curve(d3.curveLinear)
	    		.x(function(d) { return xScale2(d.date); })
	    		.y(function(d) { return yScale2(d.temperature); });

			var enterLine = d3.line()
	    		.curve(d3.curveLinear)
	    		.x(function(d) { return xScale(d.date); })
	    		.y(function() { return height; });

    		lines = svg.select('g.lines').selectAll('path.line').data(data, function(d){ return d.key; });

    		lines
    			.enter()
    			.append('path')
    			.attr('opacity', 0)
    			.attr('class', 'line')
    			.style('fill', 'none')
    			.style('clip-path', 'url(#clip)')
    			.style('stroke', function(d) { return c(d.key); })
    			.attr('d', function(d) { return enterLine(d.values); })
			.merge(lines)
    			.transition().duration(tt)
    			.attr('opacity', 1)
    			.attr('d', function(d) { return line(d.values); });

			lines
				.exit()
				.transition().duration(tt)
				.attr('opacity', 1)
				.remove();

			lines2 = d3.select(el).select('svg').select('g.context').selectAll('path.line2').data(data, function(d){ return d.key; });

    		lines2
    			.enter()
    			.append('path')
    			.attr('opacity', 0)
    			.attr('class', 'line2')
    			.style('fill', 'none')
    			.style('stroke', function(d) { return c(d.key); })
			.merge(lines2)
    			.transition().duration(tt)
    			.attr('opacity', 1)
    			.attr('d', function(d) { return line2(d.values); });

			lines2
				.exit()
				.transition().duration(tt)
				.attr('opacity', 1)
				.remove();
		};

		$linechartCtrl.init();

		var timeout;
		window.onresize = function() {
			clearTimeout(timeout);
			timeout = setTimeout(function(){
    			$linechartCtrl.init();
			}, 1000);
		};
	}
});
