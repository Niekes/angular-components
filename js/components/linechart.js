'use strict';

app.component('linechart', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$linechartCtrl',
	controller: function($rootScope, $element, DEFAULTS){

		var c = d3.scaleOrdinal(d3.schemeDark2);
		var tt = DEFAULTS.TRANSITION.TIME;
		var $linechartCtrl = this;
		var el = $element[0];
		var height;
		var width;
		var svg;
		var xAxis;
		var yAxis;
		var xScale1;
		var xScale2;
		var yScale1;
		var yScale2;
		var line;


		$linechartCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 20, right: 20, bottom: 20, left: 40};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

			var zoom = d3.zoom()
				.scaleExtent([1, Infinity])
				.translateExtent([[0, 0], [width, height]])
				.extent([[0, 0], [width, height]])
				.on('zoom', zoomed);

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			svg
				.append('g')
				.attr('class', 'lines')
				.attr('clip-path', 'url(#clipPath)');

			svg.append('g')
				.attr('opacity', 0)
				.attr('class', 'axis x justText')
				.attr('transform', 'translate(0,' + height + ')');

			svg.append('g')
				.attr('opacity', 0)
				.attr('class', 'axis y');

			svg.append('defs')
				.append('clipPath')
				.attr('id', 'clipPath')
				.append('rect')
				.attr('width', width)
				.attr('height', height);

			svg.append('rect')
				.attr('class', 'zoom')
				.attr('width', width)
				.attr('height', height)
				.call(zoom);

		};

		function zoomed(){
			if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') { return; }
  			var t = d3.event.transform;
  			xScale1.domain(t.rescaleX(xScale2).domain());
  			svg.select('g.lines').selectAll('path.line').attr('d', function(d) { return line(d.values); });
  			svg.select('g.x.axis').call(xAxis);
		}

		$linechartCtrl.$onChanges = function(changes){
			$linechartCtrl.update(el, changes.data.currentValue);
		};

		$linechartCtrl.update = function(el, data){

			var yMin = d3.min(data, function(d) { return d3.min(d.values, function(d) { return d.y; }); });
			var yMax = d3.max(data, function(d) { return d3.max(d.values, function(d) { return d.y; }); });

			xScale1 = d3.scaleTime()
				.domain(d3.min(data, function(d) { return d3.extent(d.values, function(d) { return d.x; }); }))
				.range([0, width]);

			xScale2 = d3.scaleTime()
				.domain(xScale1.domain())
				.range(xScale1.range());

			yScale1 = d3.scaleLinear()
			    .domain([yMin, yMax])
			    .range([height, 0])
			    .nice();

			xAxis = d3.axisBottom(xScale1).tickFormat(d3.timeFormat('%b %d'));
		    yAxis = d3.axisLeft(yScale1).ticks(4);

		    svg.select('g.x.axis').transition().duration(tt).attr('opacity', 1).call(xAxis);
		    svg.select('g.y.axis').transition().duration(tt).attr('opacity', 1).call(yAxis);

			line = d3.line()
	    		.curve(d3.curveBasis)
	    		.x(function(d) { return xScale1(d.x); })
	    		.y(function(d) { return yScale1(d.y); });

			var enterLine = d3.line()
	    		.curve(d3.curveBasis)
	    		.x(function(d) { return xScale1(d.x); })
	    		.y(height);

    		var lines = svg.select('g.lines').selectAll('path.line').data(data, function(d){ return d.key; });

    		lines
    			.enter()
    			.append('path')
    			.attr('opacity', 0)
    			.attr('class', 'line')
    			.style('fill', 'none')
    			.style('stroke', function(d) { return c(d.key); })
    			.attr('d', function(d) { return enterLine(d.values); })
			.merge(lines)
    			.transition().duration(tt)
    			.attr('opacity', 1)
    			.attr('d', function(d) { return line(d.values); });

			lines
				.exit()
				.transition().duration(tt)
				.attr('d', function(d) { return enterLine(d.values); })
				.attr('opacity', 0)
				.remove();
		};

		$linechartCtrl.init();

		$rootScope.$on('window:resize', function(){
			$linechartCtrl.init();
		});
	}
});
