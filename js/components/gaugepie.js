'use strict';

app.component('gaugepie', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$gaugepieCtrl',
	controller: function($rootScope, $element, DEFAULTS){

		var $gaugepieCtrl = this;
		var arc;
		var bg = d3.color(DEFAULTS.COLORS.BG);
		var el = $element[0];
		var height;
		var radius;
		var svg;
		var tt = DEFAULTS.TRANSITION.TIME;
		var width;
		var endAngle = 3/2*Math.PI; // 270°
		var startAngle = ((2*Math.PI - endAngle)/2) - Math.PI;
		var scale = d3.scaleLinear().domain([0, 1]).range([startAngle, startAngle + endAngle]);

		$gaugepieCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 20, right: 0, bottom: 0, left: 20};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

			radius = (Math.min(width, height)/2) - (margin.right + margin.left);

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			arc = d3.arc()
	    		.innerRadius(radius - (radius/5))
	    		.outerRadius(radius)
	    		.startAngle(startAngle);

			var gaugepie = svg
				.append('g')
				.attr('class', 'gaugepie')
				.attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');

			gaugepie
				.append('path')
					.attr('class', 'arc')
					.datum({ endAngle: startAngle })
    				.style('fill', bg.darker(0.5))
    				.transition().duration(tt*2)
    				.attrTween('d', $gaugepieCtrl.arcTween(startAngle + endAngle));

			gaugepie
				.append('path')
				.attr('class', 'indicator');

			// gaugepie
			// 	.append('circle')
			// 	.attr('class', 'c')
			// 	.attr('cx', Math.cos(startAngle + endAngle + endAngle)*radius)
			// 	.attr('cy', Math.sin(startAngle + endAngle + endAngle)*radius)
			// 	.attr('r', 10);


		};

		$gaugepieCtrl.$onChanges = function(changes){
			$gaugepieCtrl.update(el, changes.data.currentValue, changes.data.previousValue);
		};

		$gaugepieCtrl.update = function(el, data, prevData){
			prevData = angular.equals(prevData, {}) ? 0 : prevData;

			svg.select('g.gaugepie').select('path.indicator')
				.datum({ endAngle: scale(prevData) })
				.transition().duration(tt)
				.attr('fill', d3.interpolateRdYlBu(data))
				.attrTween('d', $gaugepieCtrl.arcTween(scale(data)));

			svg.select('g.gaugepie')
				.append('circle')
				.attr('class', 'c')
				.attr('fill', 'white')
				.attr('cx', Math.cos(scale(data)-endAngle+Math.PI)*radius)
				.attr('cy', Math.sin(scale(data)-endAngle+Math.PI)*radius)
				.attr('r', 10);

		};


		$gaugepieCtrl.arcTween = function(newAngle){
			return function(d){
				var interpolate = d3.interpolate(d.endAngle, newAngle);
				return function(t){
					d.endAngle = interpolate(t);
					return arc(d);
				};
			};
		};

		$gaugepieCtrl.init();

		$rootScope.$on('window:resize', function(){
			$gaugepieCtrl.init();
		});
	}
});
