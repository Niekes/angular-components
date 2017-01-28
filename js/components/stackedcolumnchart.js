'use strict';

app.component('stackedColumnChart', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$stackedcolumnchartCtrl',
	controller: function($element, DEFAULTS){

		var $stackedcolumnchartCtrl = this;
		var el = $element[0];
		var svg;
		var height;
		var width;
		var color = d3.scaleOrdinal(d3.schemeDark2.reverse());
		var transitionTime = 1000;

		$stackedcolumnchartCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 40, right: 20, bottom: 30, left: 40};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			svg.append('g')
				.attr('class', 'stacks');

			svg.append('g')
				.attr('opacity', 0)
				.attr('class', 'axis x noText')
				.attr('transform', 'translate(0,' + height + ')');

			svg.append('g')
				.attr('opacity', 0)
				.attr('class', 'axis x justText')
				.attr('transform', 'translate(0,' + height + ')');

			svg.append('g')
				.attr('opacity', 0)
				.attr('class', 'axis y');
		};

		$stackedcolumnchartCtrl.$onChanges = function(changes){
			$stackedcolumnchartCtrl.update(el, changes.data.currentValue);
		};

		$stackedcolumnchartCtrl.update = function(el, data){

			var stackedData = $stackedcolumnchartCtrl.stackData(data);

			var xScale = d3.scaleBand()
				.domain(stackedData.map(function(d){ return d.name; }))
				.rangeRound([0, width ])
				.padding(0.5);

			var yScale = d3.scaleLinear()
			    .domain([stackedData.yMin, stackedData.yMax])
			    .range([height, 0])
			    .nice();

		    var xAxis = d3.axisBottom(xScale).tickSizeOuter(0).tickSizeOuter(0).tickSizeInner(0);
		    var yAxis = d3.axisLeft(yScale);

		    svg.select('g.x.axis').transition().duration(transitionTime)
		    	.attr('opacity', 1)
		    	.attr('transform', 'translate(0,' + yScale(0) + ')')
		    	.call(xAxis);

		    svg.select('g.x.axis.justText').transition().duration(transitionTime).attr('opacity', 1).call(xAxis.tickSizeInner(6));
		    svg.select('g.y.axis').transition().duration(transitionTime).attr('opacity', 1).call(yAxis);

		    var stack = svg.select('g.stacks').selectAll('g.stack').data(data, function(d){ return d.name; });

		    var stackEnter = stack
		    	.enter()
		    	.append('g')
		    	.attr('class', 'stack')
		    	.attr('transform', function(d){
	    			var xPos = xScale(d.name);
					return 'translate('+ xPos +', 0)';
				})
		    	.style('opacity', 0)
	    	.merge(stack)
	    		.transition().duration(DEFAULTS.TRANSITION.TIME)
	    		.attr('transform', function(d){
	    			var xPos = xScale(d.name);
					return 'translate('+ xPos +', 0)';
				})
		    	.style('opacity', 1);

    		stack
    			.exit()
				.transition().duration(DEFAULTS.TRANSITION.TIME)
				.style('opacity', 0)
				.remove();

			var bar = stack.merge(stackEnter).selectAll('rect.bar').data(function(d) { return d.values; }, function(d){	return d.name; });

			bar
				.enter()
				.append('rect')
				.attr('class' ,'bar')
				.attr('y', yScale(0))
				.attr('width', xScale.bandwidth())
				.attr('height', 0)
			.merge(bar)
				.transition().duration(DEFAULTS.TRANSITION.TIME)
				.attr('y', function(d) { return yScale(d.y0); })
				.attr('width', xScale.bandwidth())
				.attr('height', function(d) { return yScale(0) - yScale(d.height); })
				.attr('fill', function(d){ 	return color(d.name); });


			bar
				.exit()
				.transition().duration(DEFAULTS.TRANSITION.TIME)
				.attr('width', 0)
				.remove();

		};

		$stackedcolumnchartCtrl.stackData = function(d){

			d.forEach(function(obj){
				var posBase = 0;
				var negBase = 0;
				obj.values.forEach(function(f){
					f.height = Math.abs(f.value);
					if(f.value < 0){
						f.y0 = negBase;
						negBase -= f.height;
					}else{
						f.y0 = posBase = posBase + f.height;
					}
				});
			});

			var yMin = d3.min(d, function(obj){
				return d3.min(obj.values, function(f){
					return f.y0 - f.height;
				});
			});

			var yMax = d3.max(d, function(obj){
				return d3.max(obj.values, function(f){
					return f.y0;
				});
			});

			d.yMin = yMin;
			d.yMax = yMax;

			return d;
		};

		$stackedcolumnchartCtrl.init();

		var timeout;
		window.onresize = function() {
			clearTimeout(timeout);
			timeout = setTimeout(function(){
    			$stackedcolumnchartCtrl.init();
			}, 1000);
		};
	}
});