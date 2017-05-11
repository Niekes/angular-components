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
		var gamma = 0; // X
		var beta = 0; // Y
		var alpha = 0; // Z
		var mouse = {};
		var mouseX;
		var mouseY;
		var color = d3.scaleOrdinal(d3.schemeDark2);
		// var zoom = d3.zoom().scaleExtent([distance, distance*10]).on('zoom', zoomed);

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
			mouse = { x: d3.event.x, y: d3.event.y };
		}

		function dragged(){
			mouseX = mouseX || 0;
			mouseY = mouseY || 0;
			beta   = (d3.event.x - mouse.x + mouseX) * Math.PI / 720 * (-1);
			gamma  = (d3.event.y - mouse.y + mouseY) * Math.PI / 720;
			$threedCtrl.update(svg.selectAll('path.line').data());
		}

		function dragEnd(){
			mouseX = d3.event.x - mouse.x + mouseX;
			mouseY = d3.event.y - mouse.y + mouseY;
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

			var x1, x2, x3, x4, y1, y2, y3, y4;

			if(defauls.projection === ortho){
				x1 = xOffset + scale * d.tl.x;
				y1 = yOffset + scale * d.tl.y;
				x2 = xOffset + scale * d.tr.x;
				y2 = yOffset + scale * d.tr.y;
				x3 = xOffset + scale * d.bl.x;
				y3 = yOffset + scale * d.bl.y;
				x4 = xOffset + scale * d.br.x;
				y4 = yOffset + scale * d.br.y;
			}

			if(defauls.projection === persp){
				x1 = xOffset + scale * d.tl.x / (d.tl.z + distance);
				y1 = yOffset + scale * d.tl.y / (d.tl.z + distance);
				x2 = xOffset + scale * d.tr.x / (d.tr.z + distance);
				y2 = yOffset + scale * d.tr.y / (d.tr.z + distance);
				x3 = xOffset + scale * d.bl.x / (d.bl.z + distance);
				y3 = yOffset + scale * d.bl.y / (d.bl.z + distance);
				x4 = xOffset + scale * d.br.x / (d.br.z + distance);
				y4 = yOffset + scale * d.br.y / (d.br.z + distance);
			}

			return {
				tl: {x: x1, y: y1},
				tr: {x: x2, y: y2},
				bl: {x: x3, y: y3},
				br: {x: x4, y: y4}
			};
		}

		function rotate(d){

		 	var r = { tl: {}, tr: {}, bl: {}, br: {} };

			Object.entries(r).forEach(([key]) => rotateRxRyRz(d, key, r));

			return r;
		}

		function rotateRxRyRz(d, k, r){
			var _d = d[k];
			var _r = r[k];

			var cosa = Math.cos(alpha);
			var sina = Math.sin(alpha);

			var cosb = Math.cos(beta);
			var sinb = Math.sin(beta);

			var cosc = Math.cos(gamma);
			var sinc = Math.sin(gamma);

		    var a1 = cosa * cosb;
		    var a2 = cosa * sinb * sinc - sina * cosc;
		    var a3 = cosa * sinb * cosc + sina * sinc;

		    var b1 = sina * cosb;
		    var b2 = sina * sinb * sinc + cosa * cosc;
		    var b3 = sina * sinb * cosc - cosa * sinc;

		    var c1 = -sinb;
		    var c2 = cosb * sinc;
		    var c3 = cosb * cosc;

			_r.x = a1 * _d.x + a2 * _d.y + a3 * _d.z;
			_r.y = b1 * _d.x + b2 * _d.y + b3 * _d.z;
			_r.z = c1 * _d.x + c2 * _d.y + c3 * _d.z;
		}

		$threedCtrl.init();

		$rootScope.$on('window:resize', function(){
			$threedCtrl.init();
		});
	}
});
