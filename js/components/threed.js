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
		var ortho = 'ortho'; // Orthographic projection
		var persp = 'persp'; // Weak perspective projection
		var scale = 1000;
		var distance = 100;
		var xOffset;
		var yOffset;
		var alpha = 0;
		var mouse = {};
		var mouseX;
		var color = d3.scaleOrdinal(d3.schemeDark2);
		// var zoom = d3.zoom().scaleExtent([distance, distance*10]).on('zoom', zoomed);
		var cos = function(a){ return Math.cos(a); };
		var sin = function(a){ return Math.sin(a); };

		// var yMatrix = [
		// 	 cos, 0, sin,
		// 	0,	  1, 0,
		// 	-sin, 0, cos
		// ];

		var defauls = {
			projection: persp // 'ortho' || 'persp'
		};

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

			// d3.select(el).select('svg').append('rect')
			// 	.attr('class', 'zoom')
			// 	.attr('fill', 'none')
			// 	.attr('width', width)
			// 	.attr('height', height)
			// 	.call(zoom)
			// 	.on('mousedown.zoom', null)
			// 	.on('touchstart.zoom', null)
			// 	.on('touchmove.zoom', null)
			// 	.on('touchend.zoom', null);

			var focus = svg.append('g').attr( 'class', 'focus');

			focus.append('path')
				.attr('stroke', '#aaa')
				.attr('d', d3.line()([[width/2,height/2+5], [width/2,height/2-5]]));

			focus.append('path')
				.attr('stroke', '#aaa')
				.attr('d', d3.line()([[width/2+5,height/2], [width/2-5,height/2]]));

		};

		// function zoomed(){
		// 	// d3.select(el).select('rect.zoom').style('cursor', 'move');
		// 	if(d3.event.sourceEvent.shiftKey){
		// 		distance  = d3.event.transform.k;
		// 		var _data =  svg.selectAll('path.line').data();
		// 		$threedCtrl.update(_data);
		// 		// d3.select(el).select('rect.zoom').style('cursor', 'crosshair');
		// 	}

		// }

		function dragStart(){
			mouse = { x: d3.event.x };
		}

		function dragged(){
			mouseX = mouseX || 0;
			alpha = -(d3.event.x - mouse.x + mouseX) * Math.PI / 180;
			var _data =  svg.selectAll('path.line').data();
			$threedCtrl.update(_data);
		}

		function dragEnd(){
			mouseX = d3.event.x - mouse.x + mouseX;
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
				.style('fill', function(d, i){ return color(i); })
				.style('stroke', function(d, i){ return d3.color(color(i)).darker(1); })
				.merge(lines)
				.attr('stroke-width', 1)
				.each(function(d){
					d.rotated 	= rotate(d);
					d.midPoint  = midPoint(d.rotated);
					d.projected = project(d.rotated);
				})
				.sort(function(d, e){
					return d3.descending(d.midPoint.z, e.midPoint.z);
				})
				.transition().duration(_tt === undefined ? 0 : tt)
				.attr('d', function(d){
					return d3.line()([
						[ d.projected.tl.x, d.projected.tl.y ],
						[ d.projected.tr.x, d.projected.tr.y ],
						[ d.projected.br.x, d.projected.br.y ],
						[ d.projected.bl.x, d.projected.bl.y ],
						[ d.projected.tl.x, d.projected.tl.y ],
						[ d.projected.tr.x, d.projected.tr.y ]
					]);
				});


			lines
				.exit()
				.remove();

		};

		function midPoint(d){
			var mx = (d.tl.x + d.br.x)/2;
			var my = (d.tl.y + d.br.y)/2;
			var mz = (d.tl.z + d.br.z)/2;
			return {x: mx, y: my, z: mz};
		}

		function project(d){

			if(defauls.projection === ortho){
				var x1 = xOffset + scale * d.tl.x;
				var y1 = yOffset + scale * d.tl.y;
				var x2 = xOffset + scale * d.tr.x;
				var y2 = yOffset + scale * d.tr.y;
				var x3 = xOffset + scale * d.bl.x;
				var y3 = yOffset + scale * d.bl.y;
				var x4 = xOffset + scale * d.br.x;
				var y4 = yOffset + scale * d.br.y;
			}

			if(defauls.projection === persp){
				var x1 = xOffset + scale * d.tl.x / (d.tl.z + distance);
				var y1 = yOffset + scale * d.tl.y / (d.tl.z + distance);
				var x2 = xOffset + scale * d.tr.x / (d.tr.z + distance);
				var y2 = yOffset + scale * d.tr.y / (d.tr.z + distance);
				var x3 = xOffset + scale * d.bl.x / (d.bl.z + distance);
				var y3 = yOffset + scale * d.bl.y / (d.bl.z + distance);
				var x4 = xOffset + scale * d.br.x / (d.br.z + distance);
				var y4 = yOffset + scale * d.br.y / (d.br.z + distance);
			}

			return {
				tl: {x: x1, y: y1},
				tr: {x: x2, y: y2},
				bl: {x: x3, y: y3},
				br: {x: x4, y: y4}
			};
		}

		function rotate(d){
			var x1 = d.tl.x *  cos(alpha) + d.tl.z * sin(alpha);
			var y1 = d.tl.y;
			var z1 = d.tl.x * -sin(alpha) + d.tl.z * cos(alpha);

			var x2 = d.tr.x *  cos(alpha) + d.tr.z * sin(alpha);
			var y2 = d.tr.y;
			var z2 = d.tr.x * -sin(alpha) + d.tr.z * cos(alpha);

			var x3 = d.bl.x *  cos(alpha) + d.bl.z * sin(alpha);
			var y3 = d.bl.y;
			var z3 = d.bl.x * -sin(alpha) + d.bl.z * cos(alpha);

			var x4 = d.br.x *  cos(alpha) + d.br.z * sin(alpha);
			var y4 = d.br.y;
			var z4 = d.br.x * -sin(alpha) + d.br.z * cos(alpha);
			return {
				tl: {x: x1, y: y1, z: z1},
				tr: {x: x2, y: y2, z: z2},
				bl: {x: x3, y: y3, z: z3},
				br: {x: x4, y: y4, z: z4}
			};
		}

		$threedCtrl.init();

		$rootScope.$on('window:resize', function(){
			$threedCtrl.init();
		});
	}
});
