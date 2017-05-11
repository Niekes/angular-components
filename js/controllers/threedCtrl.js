'use strict';

app.controller('threedCtrl', function(){

	var threedCtrl = this;

	function updateData(){

		var cube0 = {key: 0, values: [cube(rndInt(2,30), -45)]};
		var cube1 = {key: 1, values: [cube(rndInt(2,30), -30)]};
		var cube2 = {key: 2, values: [cube(rndInt(2,30), -15)]};
		var cube3 = {key: 3, values: [cube(rndInt(2,30),  0)]};
		var cube4 = {key: 4, values: [cube(rndInt(2,30),  15)]};
		var cube5 = {key: 5, values: [cube(rndInt(2,30),  30)]};
		var cube6 = {key: 6, values: [cube(rndInt(2,30),  45)]};

		threedCtrl.data = [
			cube0,
			cube1,
			cube2,
			cube3,
			cube4,
			cube5,
			cube6,
		];
	}

	function rndInt(min, max){
		return Math.floor(d3.randomUniform(min, max)());
	}

	updateData();

	threedCtrl.updateData = function(){
		updateData();
	};

	function cube(h, x){

		var m  =  5;
		var	n  = -5;
		var xn = n+x;
		var xm = m+x;

		return [
			{
				name: 'front',
				tl: {x: xn, y: h, z: n}, tr: {x: xm, y: h, z: n},
			  	bl: {x: xn, y: n, z: n}, br: {x: xm, y: n, z: n}
			},
			{
				name: 'back',
				tl: {x: xn, y: h, z: m}, tr: {x: xm, y: h, z: m},
			  	bl: {x: xn, y: n, z: m}, br: {x: xm, y: n, z: m}
			},
			{
				name: 'left',
				tl: {x: xn, y: h, z: n}, tr: {x: xn, y: h, z: m},
			  	bl: {x: xn, y: n, z: n}, br: {x: xn, y: n, z:  m}
			},
			{
				name: 'right',
				tl: {x: xm, y: h, z: n}, tr: {x: xm, y: h, z: m},
			  	bl: {x: xm, y: n, z: n}, br: {x: xm, y: n, z: m}
			},
			{
				name: 'top',
				tl: {x: xn, y: h, z: n}, tr: {x: xm, y: h, z: n},
			  	bl: {x: xn, y: h, z: m}, br: {x: xm, y: h, z: m}
			},
		];
	}
});
