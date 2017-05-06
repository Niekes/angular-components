'use strict';

app.component('threed', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$threedCtrl',
	controller: function($rootScope, $element, $filter, DEFAULTS){

		var svg;
		var width;
		var height;
		var el = $element[0];
		var $threedCtrl = this;
		var tt = DEFAULTS.TRANSITION.TIME;
		var scale = 50;
		var distance = 10;
		var xOffset;
		var yOffset;
		var alpha;
		var beta = Math.PI/2;
		var gamma = 0;
		var cos = function(a){ return Math.cos(a); };
		var sin = function(a){ return Math.sin(a); };
		var data = [
			[-15,15,0],
			[15,15,0],
			[15,-15,0],
			[-15,-15,0],
			[-15,15,0],
		];

		document.querySelector('article').style.backgroundColor = 'white';

		$threedCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 0, right: 0, bottom: 0, left: 0};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

 			xOffset = width/2;
			yOffset = height/2;

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			svg.append('path').attr('class', 'line');

			var focus =  svg.append('g').attr( 'class', 'focus');

			focus.append('path')
				.attr('stroke', 'black')
				.attr('d', d3.line()([[width/2,height/2+10], [width/2,height/2-10]]));

			focus.append('path')
				.attr('stroke', 'black')
				.attr('d', d3.line()([[width/2+10,height/2], [width/2-10,height/2]]));

		};

		$threedCtrl.$onChanges = function(changes){
			$threedCtrl.update(changes.data.currentValue, changes.data.previousValue);
		};

		$threedCtrl.update = function(angle, previousAngle){
			previousAngle = angular.equals(previousAngle, {}) ? 0 : previousAngle;

			alpha = angle;
			var d = rotate(data);
			var p = transform(d);
			var line = d3.line();

			svg
				.select('path.line')
				.attr('stroke', 'black')
				.attr('fill', 'none')
				.attr('d', line(p));
		};

		function rotate(d){
			var _d = [];
			d.forEach(function(_e){
				_d.push([
					_e[0]*cos(alpha)+_e[2]*sin(alpha),
					_e[1],
					-sin(alpha)*_e[0]+_e[2]*cos(alpha)
				]);
			});

			return _d;
		}

		function transform(d){
			var _d = [];
			d.forEach(function(_e){
				_d.push([
					xOffset + scale * _e[0] / (_e[2] + distance),
					yOffset + scale * _e[1] / (_e[2] + distance)
				]);
			});
			return _d;
		}

		$threedCtrl.init();

		$rootScope.$on('window:resize', function(){
			$threedCtrl.init();
		});
	}
});
