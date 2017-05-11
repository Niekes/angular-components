'use strict';

app.controller('threedCtrl', function(){

	var threedCtrl = this;

	// var data = [
	// 	{ sp: {x: -1, y:  1, z: -1}, ep: {x:  1, y:  1, z: -1} },
	// 	{ sp: {x: -1, y: -1, z: -1}, ep: {x:  1, y: -1, z: -1} },
	// 	{ sp: {x:  1, y: -1, z: -1}, ep: {x:  1, y:  1, z: -1} },
	// 	{ sp: {x: -1, y: -1, z: -1}, ep: {x: -1, y:  1, z: -1} },
	// 	{ sp: {x: -1, y:  1, z:  1}, ep: {x:  1, y:  1, z:  1} },
	// 	{ sp: {x: -1, y: -1, z:  1}, ep: {x:  1, y: -1, z:  1} },
	// 	{ sp: {x:  1, y: -1, z:  1}, ep: {x:  1, y:  1, z:  1} },
	// 	{ sp: {x: -1, y: -1, z:  1}, ep: {x: -1, y:  1, z:  1} },
	// 	{ sp: {x: -1, y: -1, z:  1}, ep: {x: -1, y: -1, z: -1} },
	// 	{ sp: {x:  1, y: -1, z:  1}, ep: {x:  1, y: -1, z: -1} },
	// 	{ sp: {x: -1, y:  1, z:  1}, ep: {x: -1, y:  1, z: -1} },
	// 	{ sp: {x:  1, y:  1, z:  1}, ep: {x:  1, y:  1, z: -1} }
	// ];

	var data = [
		{
			tl: {x: -1, y:  1, z: -1}, tr: {x:  1, y:  1, z: -1},
		  	bl: {x: -1, y: -1, z: -1}, br: {x:  1, y: -1, z: -1}
		},
		{
			tl: {x: -1, y:  1, z:  1}, tr: {x:  1, y:  1, z:  1},
		  	bl: {x: -1, y: -1, z:  1}, br: {x:  1, y: -1, z:  1}
		},
		{
			tl: {x: -1, y:  1, z: -1}, tr: {x: -1, y:  1, z:  1},
		  	bl: {x: -1, y: -1, z: -1}, br: {x: -1, y: -1, z:  1}
		},
		{
			tl: {x:  1, y:  1, z: -1}, tr: {x:  1, y:  1, z:  1},
		  	bl: {x:  1, y: -1, z: -1}, br: {x:  1, y: -1, z:  1}
		},
		{
			tl: {x: -1, y:  1, z: -1}, tr: {x:  1, y:  1, z: -1},
		  	bl: {x: -1, y:  1, z:  1}, br: {x:  1, y:  1, z:  1}
		},
		{
			tl: {x: -1, y: -1, z: -1}, tr: {x:  1, y: -1, z: -1},
		  	bl: {x: -1, y: -1, z:  1}, br: {x:  1, y: -1, z:  1}
		},
	];

	function updateData(){
		threedCtrl.data = randomizeData();
	}

	function randomizeData(){
		var e = angular.copy(data);
		var r = 18;
		e.forEach(function(p){
			p.tl.x *= r;
			p.tl.y *= r;
			p.tl.z *= r;

			p.tr.x *= r;
			p.tr.y *= r;
			p.tr.z *= r;

			p.bl.x *= r;
			p.bl.y *= r;
			p.bl.z *= r;

			p.br.x *= r;
			p.br.y *= r;
			p.br.z *= r;
		});
		return e;
	}

	function rndInt(min, max){
		return Math.floor(d3.randomUniform(min, max)());
	}

	updateData();

	threedCtrl.updateData = function(){
		updateData();
	};
});
