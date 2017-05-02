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
		var n = 100;
		var el = $element[0];
		var centerRadius;
		var $gaugepieCtrl = this;
		var tt = DEFAULTS.TRANSITION.TIME;
		var bg = d3.color(DEFAULTS.COLORS.BG);
		var startAngle =11/6*pi; // 330°
		var endAngle = (2*pi - startAngle)/2;
		var scale = d3.scaleLinear().domain([0, 1]).range([endAngle + pi/2, startAngle + endAngle + pi/2]);
		var ra = d3.range(scale.range()[0], scale.range()[1], scale.range()[1] / n);

		$gaugepieCtrl.init = function(){

			angular.element(el).empty();

			var margin = 30;

			width = el.clientWidth;
			height = el.clientHeight;

			innerRadius = Math.min(width, height)/2 - margin;
			centerRadius = innerRadius - (innerRadius/5);

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
				.attr('class', 'knob')
				.attr('fill', bg.brighter(3))
				.attr('opacity', 1);


			svg
				.selectAll('circle.indicator')
				.data(ra)
				.enter()
				.append('circle')
				.attr('class', 'indicator')
				.attr('fill', bg.brighter(2))
				.attr('r', 1)
				.attr('cx', function(d){
					return Math.cos(d)*(innerRadius+(margin/2));
				})
				.attr('cy', function(d){
					return Math.sin(d)*(innerRadius+(margin/2));
				});
		};

		$gaugepieCtrl.$onChanges = function(changes){
			$gaugepieCtrl.update(el, changes.data.currentValue, changes.data.previousValue);
		};

		$gaugepieCtrl.update = function(el, data, prevData){
			prevData = angular.equals(prevData, {}) ? 0 : prevData;

			svg.select('path.knob')
				.datum({ oldPoint: scale(prevData) })
				.transition().duration(tt)
				.attr('opacity', 1)
				.attrTween('d', lineTween(scale(data)));

			svg.selectAll('circle.indicator')
				.transition().duration(tt).delay(function(d, i){
					return d < scale(data) ? (15*i)/2 : ((ra.length-i)*15)/2;
				})
				.attrTween('fill', function(d){
					var c = d3.select(this).attr('fill');
					var i1 = d3.interpolateRgb(c, d3.color('hotpink').brighter());
					var i2 = d3.interpolateRgb(c, bg.brighter(2));
					return function(t){
						return d < scale(data) ? i1(t) : i2(t);
					};
				});

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
