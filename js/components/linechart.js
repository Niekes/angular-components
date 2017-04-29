'use strict';

app.component('linechart', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$linechartCtrl',
	controller: function($rootScope, $element, DEFAULTS){

		var sub;
		var main;
		var zoom;
		var line;
		var brush;
		var width;
		var xAxis;
		var yAxis;
		var height;
		var height2;
		var xScale1;
		var xScale2;
		var yScale1;
		var yScale2;
		var subLine;
		var baseLine;
		var subbaseLine;

		var el 			   = $element[0];
		var $linechartCtrl = this;
		var tt 			   = DEFAULTS.TRANSITION.TIME;
		var c 			   = d3.scaleOrdinal(d3.schemeDark2);

		$linechartCtrl.init = function(){

			angular.element(el).empty();

			var margin1 = {top: 20, right: 20, bottom: 120, left: 40};

			width = el.clientWidth - margin1.left - margin1.right;
			height = el.clientHeight - margin1.top - margin1.bottom;

			var margin2 = {top: height + 40, right: margin1.right, bottom: 20, left: margin1.left};

			height2 = height + margin1.top + margin1.bottom - margin2.top - margin2.bottom;

			xScale1 = d3.scaleTime().range([0, width]);
			xScale2 = d3.scaleTime().range([0, width]);

			yScale1 = d3.scaleLinear().range([height, 0]);
			yScale2 = d3.scaleLinear().range([height2, 0]);

			xAxis = d3.axisBottom(xScale1).tickFormat(d3.timeFormat('%b %d'));
		    yAxis = d3.axisLeft(yScale1);

			zoom = d3.zoom()
				.scaleExtent([1, 10])
				.translateExtent([[0, 0], [width, height]])
				.extent([[0, 0], [width, height]])
				.on('zoom', zoomed);

			brush = d3.brushX()
    			.extent([[0, 0], [width, height2]])
    			.on('brush end', brushed);

    		main = d3.select(el).append('svg')
				.attr('width', width + margin1.left + margin1.right)
				.attr('height', height + margin1.top + margin1.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin1.left + ',' + margin1.top + ')');

			main
				.append('g')
				.attr('class', 'lines')
				.attr('clip-path', 'url(#clipPath)');

			main.append('g')
				.attr('opacity', 0)
				.attr('class', 'axis x justText')
				.attr('transform', 'translate(0,' + height + ')');

			main.append('g')
				.attr('opacity', 0)
				.attr('class', 'axis y');

			main.append('defs')
				.append('clipPath')
				.attr('id', 'clipPath')
				.append('rect')
				.attr('width', width)
				.attr('height', height);

			main.append('rect')
				.attr('class', 'zoom')
				.attr('width', width)
				.attr('height', height)
				.call(zoom);

			sub = d3.select(el).select('svg')
				.append('g')
				.attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

			sub
				.append('g')
				.attr('class', 'lines');

			sub.append('g')
				.attr('class', 'brush')
				.call(brush)
				.call(brush.move, [0, width])
				.on('dblclick', function(){
					d3.select(this)
					.transition().duration(tt)
	    			.call(brush.move, [0, width]);
				});

			sub.append('g')
				.attr('opacity', 0)
				.attr('class', 'axis x2')
				.attr('transform', 'translate(0,' + height2 + ')');

		};

		$linechartCtrl.$onChanges = function(changes){
			$linechartCtrl.update(el, changes.data.currentValue);
		};

		$linechartCtrl.update = function(el, data){

			var yMin = d3.min(data, function(d) { return d3.min(d.values, function(d) { return d.y; }); });
			var yMax = d3.max(data, function(d) { return d3.max(d.values, function(d) { return d.y; }); });

			xScale1.domain(d3.min(data, function(d) { return d3.extent(d.values, function(d) { return d.x; }); }));
			xScale2.domain(xScale1.domain());

			yScale1.domain([yMin, yMax]).nice();
			yScale2.domain(yScale1.domain());

		    main.select('g.x.axis').transition().duration(tt).attr('opacity', 1).call(xAxis);
		    main.select('g.y.axis').transition().duration(tt).attr('opacity', 1).call(yAxis);
		    main.select('rect.zoom').transition().duration(tt).call(zoom.transform, d3.zoomIdentity);
		    sub.select('g.x2.axis').transition().duration(tt).attr('opacity', 1).call(xAxis);
		    // sub.select('g.brush').select('.selection').transition().duration(tt*5).attr('fill', 'green');

			line = d3.line()
	    		.curve(d3.curveBasis)
	    		.x(function(d) { return xScale1(d.x); })
	    		.y(function(d) { return yScale1(d.y); });

			subLine = d3.line()
	    		.curve(d3.curveBasis)
	    		.x(function(d) { return xScale2(d.x); })
	    		.y(function(d) { return yScale2(d.y); });

			baseLine = d3.line()
	    		.curve(d3.curveBasis)
	    		.x(function(d) { return xScale1(d.x); })
	    		.y(height);

			subbaseLine = d3.line()
	    		.curve(d3.curveBasis)
	    		.x(function(d) { return xScale2(d.x); })
	    		.y(height2);

    		var lines = main.select('g.lines').selectAll('path.line').data(data, function(d){ return d.key; });

    		lines
    			.enter()
    			.append('path')
    			.attr('opacity', 0)
    			.attr('class', 'line')
    			.style('fill', 'none')
    			.style('stroke', function(d) { return c(d.key); })
    			.attr('d', function(d) { return baseLine(d.values); })
			.merge(lines)
    			.transition().duration(tt)
    			.attr('opacity', 1)
    			.attr('d', function(d) { return line(d.values); });

			lines
				.exit()
				.transition().duration(tt)
				.attr('d', function(d) { return baseLine(d.values); })
				.attr('opacity', 0)
				.remove();

			var subLines = sub.select('g.lines').selectAll('path.line').data(data, function(d){ return d.key; });

    		subLines
    			.enter()
    			.append('path')
    			.attr('opacity', 0)
    			.attr('class', 'line')
    			.style('fill', 'none')
    			.style('stroke', function(d) { return c(d.key); })
    			.attr('d', function(d) { return subbaseLine(d.values); })
			.merge(subLines)
    			.transition().duration(tt)
    			.attr('opacity', 1)
    			.attr('d', function(d) { return subLine(d.values); });

			subLines
				.exit()
				.transition().duration(tt)
				.attr('d', function(d) { return subbaseLine(d.values); })
				.attr('opacity', 0)
				.remove();
		};

		function zoomed(){
			if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') { return; }
  			var t = d3.event.transform;
  			xScale1.domain(t.rescaleX(xScale2).domain());
  			main.select('g.lines').selectAll('path.line').attr('d', function(d) { return line(d.values); });
  			main.select('g.x.axis').call(xAxis);
  			sub.select('.brush').call(brush.move, xScale1.range().map(t.invertX, t));
		}

		function brushed(){
			if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') { return; }
			var s = d3.event.selection || xScale2.range();
			xScale1.domain(s.map(xScale2.invert, xScale2));
			main.select('g.lines').selectAll('path.line').attr('d', function(d) { return line(d.values); });
			main.select('g.x.axis').call(xAxis);
			main.select('.zoom').call(zoom.transform, d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0));
		}

		$linechartCtrl.init();

		$rootScope.$on('window:resize', function(){
			$linechartCtrl.init();
		});
	}
});
