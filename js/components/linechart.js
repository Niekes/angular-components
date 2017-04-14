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
		var xScale2;
		var xScale;
		var height;
		var width;
		var lines;
		var xAxis;
		var line;
		var zoom;
		var svg;

		$linechartCtrl.init = function(){

			d3.csv('data/berlin-weather.csv', row, function(error, data){

				angular.element(el).empty();

				var margin = {top: 20, right: 20, bottom: 20, left: 30};

				width = el.clientWidth - margin.left - margin.right;
				height = el.clientHeight - margin.top - margin.bottom;

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


				$linechartCtrl.update(el, [{key: 'Berlin', values: data}]);
			});

		};

		function row(d){
			return {
				date: parseTime(d.MESS_DATUM_BEGINN.trim()),
				temperature: parseInt(d.LUFTTEMPERATUR),
			};
		}

		function zoomed(){
			var t = d3.event.transform;
			xScale.domain(t.rescaleX(xScale2).domain());
			svg.select('g.lines').selectAll('path.line').attr('d', function(d) { return line(d.values); });
			svg.select('g.x.axis').call(xAxis);
		}

		$linechartCtrl.update = function(el, data){

			var yMin = d3.min(data, function(d) { return d3.min(d.values, function(d) { return d.temperature; }); });
			var yMax = d3.max(data, function(d) { return d3.max(d.values, function(d) { return d.temperature; }); });

			xScale = d3.scaleTime()
				.domain(d3.min(data, function(d) { return d3.extent(d.values, function(d) { return d.date; }); }))
				.range([0, width]);

			xScale2 = d3.scaleTime()
				.domain(d3.min(data, function(d) { return d3.extent(d.values, function(d) { return d.date; }); }))
				.range([0, width]);

			var yScale = d3.scaleLinear()
			    .domain([yMin, yMax+5])
			    .range([height, 0])
			    .nice();

			xAxis = d3.axisBottom(xScale);
		    var yAxis = d3.axisLeft(yScale).ticks(4);

		    svg.select('g.x.axis').transition().duration(tt).attr('opacity', 1).call(xAxis);
		    svg.select('g.y.axis').transition().duration(tt).attr('opacity', 1).call(yAxis);

			line = d3.line()
	    		.curve(d3.curveLinear)
	    		.x(function(d) { return xScale(d.date); })
	    		.y(function(d) { return yScale(d.temperature); });

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
