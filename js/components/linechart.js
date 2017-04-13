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
		var height;
		var width;
		var svg;

		$linechartCtrl.init = function(){

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

		};

		$linechartCtrl.$onChanges = function(changes){
			if(changes.data.currentValue !== undefined){
				$linechartCtrl.update(el, changes.data.currentValue);
			}
		};

		$linechartCtrl.update = function(el, data){

			var yMin = d3.min(data, function(d) { return d3.min(d.values, function(d) { return d.temperature; }); });
			var yMax = d3.max(data, function(d) { return d3.max(d.values, function(d) { return d.temperature; }); });

			var xScale = d3.scaleTime()
				.domain(d3.min(data, function(d) { return d3.extent(d.values, function(d) { return d.date; }); }))
				.range([0, width]);

			var yScale = d3.scaleLinear()
			    .domain([yMin, yMax+5])
			    .range([height, 0])
			    .nice();

			var xAxis = d3.axisBottom(xScale);
		    var yAxis = d3.axisLeft(yScale).ticks(4);

		    svg.select('g.x.axis').transition().duration(tt).attr('opacity', 1).call(xAxis);
		    svg.select('g.y.axis').transition().duration(tt).attr('opacity', 1).call(yAxis);

			var line = d3.line()
	    		.curve(d3.curveLinear)
	    		.x(function(d) { return xScale(d.date); })
	    		.y(function(d) { return yScale(d.temperature); });

			var enterLine = d3.line()
	    		.curve(d3.curveLinear)
	    		.x(function(d) { return xScale(d.date); })
	    		.y(function() { return height; });

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
