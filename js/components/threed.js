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
		var scale = 1500;
		var distance = 100;
		var xOffset;
		var yOffset;
		var alpha = 0;
		var mouse = {};
		var mouseX;
		// var beta = Math.PI/2;
		// var gamma = 0;
		var cos = function(a){ return Math.cos(a); };
		var sin = function(a){ return Math.sin(a); };

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
				.call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd))
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			var focus = svg.append('g').attr( 'class', 'focus');

			focus.append('path')
				.attr('stroke', '#aaa')
				.attr('d', d3.line()([[width/2,height/2+10], [width/2,height/2-10]]));

			focus.append('path')
				.attr('stroke', '#aaa')
				.attr('d', d3.line()([[width/2+10,height/2], [width/2-10,height/2]]));

		};

		function dragStart(){
			mouse = {
				x: d3.event.x
			};
		}

		function dragged(){
			mouseX = mouseX || 0;
			alpha = (((d3.event.x - mouse.x) + mouseX)) * Math.PI / 180;
			var _data =  svg.selectAll('path.line').data();
			$threedCtrl.update(_data);
		}

		function dragEnd(){
			mouseX = ((d3.event.x - mouse.x) + mouseX);
		}

		$threedCtrl.$onChanges = function(changes){
			$threedCtrl.update(changes.data.currentValue, tt);
		};

		$threedCtrl.update = function(data, _tt){

			var lines = svg.selectAll('path.line').data(data);

			lines
				.enter()
				.append('path')
				.attr('class', 'line')
				.merge(lines)
				.each(function(d){
					d.rotated 	  = rotate(d);
					d.projected = project(d.rotated);
				})
				.style('stroke', 'black')
				.attr('stroke-width', 1)
				.transition().duration(_tt === undefined ? 0 : tt)
				.attr('d', function(d){
					return d3.line()([
						[ d.projected.sp.x, d.projected.sp.y ],
						[ d.projected.ep.x, d.projected.ep.y ]
					]);
				});

			lines
				.exit()
				.remove();

		};

		function project(d){
			var x1 = xOffset + scale * d.sp.x / (d.sp.z + distance);
			var y1 = yOffset + scale * d.sp.y / (d.sp.z + distance);
			var x2 = xOffset + scale * d.ep.x / (d.ep.z + distance);
			var y2 = yOffset + scale * d.ep.y / (d.ep.z + distance);

			return {
				sp: {x: x1, y: y1},
				ep: {x: x2, y: y2}
			};
		}

		function rotate(d){
			var x1 = d.sp.x *  cos(alpha) + d.sp.z * sin(alpha);
			var y1 = d.sp.y;
			var z1 = d.sp.x * -sin(alpha) + d.sp.z * cos(alpha);

			var x2 = d.ep.x *  cos(alpha) + d.ep.z * sin(alpha);
			var y2 = d.ep.y;
			var z2 = d.ep.x * -sin(alpha) + d.ep.z * cos(alpha);

			return {
				sp: {x: x1, y: y1, z: z1},
				ep: {x: x2, y: y2, z: z2}
			};
		}

		$threedCtrl.init();

		$rootScope.$on('window:resize', function(){
			$threedCtrl.init();
		});
	}
});
