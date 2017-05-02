'use strict';

app.component('gaugepie', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$gaugepieCtrl',
	controller: function($rootScope, $element, $filter, DEFAULTS){

		var svg;
		var width;
		var height;
		var innerRadius;
		var pi = Math.PI;
		var tlr = pi/2;
		var el = $element[0];
		var centerRadius = 250;
		var $gaugepieCtrl = this;
		var tt = DEFAULTS.TRANSITION.TIME;
		var bg = d3.color(DEFAULTS.COLORS.BG);
		var scale = d3.scaleLinear().domain([0, 1]).range([pi, -pi]);

		$gaugepieCtrl.init = function(){

			angular.element(el).empty();

			var margin = 20;

			width = el.clientWidth;
			height = el.clientHeight;

			innerRadius = Math.min(width, height)/2 - margin;

    		svg = d3.select(el).append('svg')
				.attr('width', width)
				.attr('height', height)
				.append('g')
					.attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');

			svg
				.append('circle')
				.attr('r', innerRadius)
				.attr('stroke', bg.darker(2))
				.attr('fill', bg.darker(1));

			svg
				.append('circle')
				.attr('r', centerRadius)
				.attr('fill', bg.brighter(3));

			svg
				.append('path')
				.attr('class', 'line')
				.attr('fill', bg.brighter(3))
				.attr('opacity', 1);

		};

		$gaugepieCtrl.$onChanges = function(changes){
			$gaugepieCtrl.update(el, changes.data.currentValue, changes.data.previousValue);
		};

		$gaugepieCtrl.update = function(el, data, prevData){
			prevData = angular.equals(prevData, {}) ? 0 : prevData;

			svg.select('path.line')
				.datum({ oldPoint: scale(prevData) })
				.transition().duration(tt)
				.attr('opacity', 1)
				.attrTween('d', lineTween(scale(data)));


		};

		function lineTween(point){
			return function(d){
				var interpolate = d3.interpolate(d.oldPoint, point);
				return function(t){
					var _in = interpolate(t);
					var _x1 = Math.cos(_in-tlr)*(centerRadius);
					var _y1 = Math.sin(_in-tlr)*(centerRadius);
					var _x2 = Math.cos(_in+tlr)*(centerRadius);
					var _y2 = Math.sin(_in+tlr)*(centerRadius);
					var _x3 = Math.cos(_in)*innerRadius;
					var _y3 = Math.sin(_in)*innerRadius;
					return d3.line()([[_x1, _y1], [_x2, _y2], [_x3, _y3]]);
				};
			};
		}

		$gaugepieCtrl.init();

		$rootScope.$on('window:resize', function(){
			$gaugepieCtrl.init();
		});
	}
});
