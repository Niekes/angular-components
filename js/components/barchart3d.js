'use strict';

app.component('barchart3d', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$barchart3dCtrl',
	controller: function($rootScope, $element, $filter, DEFAULTS){

		var svg;
		var width;
		var height;
		var el = $element[0];
		var $barchart3dCtrl = this;
		var tt = DEFAULTS.TRANSITION.TIME;
		var gamma = 0;
		var beta = 0;
		var alpha = 0;
		var mouse = {};
		var mouseX;
		var mouseY;
		var color = d3.scaleOrdinal(d3.schemeDark2);

		$barchart3dCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 0, right: 0, bottom: 0, left: 0};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd))
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
		};

		function dragStart(){
			mouse = { x: d3.event.x, y: d3.event.y };
		}

		function dragged(){
			mouseX = mouseX || 0;
			mouseY = mouseY || 0;
			beta   = (d3.event.x - mouse.x + mouseX) * Math.PI / 720 * (-1);
			gamma  = (d3.event.y - mouse.y + mouseY) * Math.PI / 720;
			$barchart3dCtrl.update(svg.selectAll('g.group').data());
		}

		function dragEnd(){
			mouseX = d3.event.x - mouse.x + mouseX;
			mouseY = d3.event.y - mouse.y + mouseY;
		}

		$barchart3dCtrl.$onChanges = function(changes){
			$barchart3dCtrl.update(changes.data.currentValue, tt);
		};

		$barchart3dCtrl.update = function(data, _tt){

			var result = barChart3d.processData(data, width/2, height*0.75, alpha, beta, gamma);

			var g = svg.selectAll('g.group').data(result, function(d){ return d.key; });

			var gEnter = g
				.enter()
				.append('g')
				.attr('class', 'group')
				.style('fill', function(d, i){ return color(i);	})
				.style('fill-opacity', 0.8)
				.style('stroke', function(d, i){ return d3.color(color(i)).darker(2); })
				.merge(g)
				.sort(function(d, e){
					var dz = (d.values[3].rotated.bl.z + d.values[3].rotated.br.z)/2;
					var ez = (e.values[3].rotated.bl.z + e.values[3].rotated.br.z)/2;
					return d3.descending(dz, ez);
				});

			g.exit().remove();

			var lines = g.merge(gEnter).selectAll('path.line').data(function(d) { return d.values; }, function(d){
				return d.name;
			});

			lines
				.enter()
				.append('path')
				.attr('class', 'line')
				.merge(lines)
				.attr('stroke-width', 1)
				.sort(function(d, e){
					var dz = (d.rotated.tl.z + d.rotated.br.z)/2;
					var ez = (e.rotated.tl.z + e.rotated.br.z)/2;
					return d3.descending(dz, ez);
				})
				.transition().duration(_tt === undefined ? 0 : tt)
				.attr('d', barChart3d.draw);

			lines
				.exit()
				.remove();

		};

		$barchart3dCtrl.init();

		$rootScope.$on('window:resize', function(){
			$barchart3dCtrl.init();
		});
	}
});

var barChart3d = {
	persp: 'persp', // Weak perspective projection
	ortho: 'ortho', // Orthographic projection
	projection: function(){
		return this.persp;
	},
	processData: function(data, xO, yO, alpha, beta, gamma){
		var that = this;
		data.forEach(function(d){
			d.values.forEach(function(_d){
				_d.rotated   = that.rotate(_d, alpha, beta, gamma);
				_d.projected = that.project(_d.rotated, xO, yO);
			});
		});
		return data;
	},
	rotate: function(d, alpha, beta, gamma){
	 	var r = { tl: {}, tr: {}, bl: {}, br: {} };
		Object.entries(r).forEach(([key]) => this.rotateRxRyRz(d[key], r[key], alpha, beta, gamma));
		return r;
	},
	project: function(d, xO, yO){
		var x1, x2, x3, x4, y1, y2, y3, y4;
		var scale = 5000;
		var distance = 1000;

		if(this.projection() === this.ortho){
			x1 = xO + scale * d.tl.x;
			y1 = yO + scale * d.tl.y;
			x2 = xO + scale * d.tr.x;
			y2 = yO + scale * d.tr.y;
			x3 = xO + scale * d.bl.x;
			y3 = yO + scale * d.bl.y;
			x4 = xO + scale * d.br.x;
			y4 = yO + scale * d.br.y;
		}

		if(this.projection() === this.persp){
			x1 = xO + scale * d.tl.x / (d.tl.z + distance);
			y1 = yO + scale * d.tl.y / (d.tl.z + distance);
			x2 = xO + scale * d.tr.x / (d.tr.z + distance);
			y2 = yO + scale * d.tr.y / (d.tr.z + distance);
			x3 = xO + scale * d.bl.x / (d.bl.z + distance);
			y3 = yO + scale * d.bl.y / (d.bl.z + distance);
			x4 = xO + scale * d.br.x / (d.br.z + distance);
			y4 = yO + scale * d.br.y / (d.br.z + distance);
		}

		return {
			tl: {x: x1, y: y1},
			tr: {x: x2, y: y2},
			bl: {x: x3, y: y3},
			br: {x: x4, y: y4}
		};
	},
	rotateRxRyRz: function(d, r, alpha, beta, gamma){

		alpha = alpha || 0; // Z
		beta  = beta  || 0;	// Y
		gamma = gamma || 0; // X

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

		r.x = a1 * d.x + a2 * -d.y + a3 * d.z;
		r.y = b1 * d.x + b2 * -d.y + b3 * d.z;
		r.z = c1 * d.x + c2 * -d.y + c3 * d.z;
	},
	draw: function(d){
		return d3.line()([
			[ d.projected.tl.x, d.projected.tl.y ],
			[ d.projected.tr.x, d.projected.tr.y ],
			[ d.projected.br.x, d.projected.br.y ],
			[ d.projected.bl.x, d.projected.bl.y ],
			[ d.projected.tl.x, d.projected.tl.y ],
		]);
	}
};
