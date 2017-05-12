'use strict';

app.controller('threedCtrl', function(){

	var threedCtrl = this;

	function updateData(){

		var cube0  = {key:  0, values: [cube(rndInt(-10,50), -33,  0)]};
		var cube1  = {key:  1, values: [cube(rndInt(-10,50), -22,  0)]};
		var cube2  = {key:  2, values: [cube(rndInt(-10,50), -11,  0)]};
		var cube3  = {key:  3, values: [cube(rndInt(-10,50),   0,  0)]};
		var cube4  = {key:  4, values: [cube(rndInt(-10,50),  11,  0)]};
		var cube5  = {key:  5, values: [cube(rndInt(-10,50),  22,  0)]};
		var cube6  = {key:  6, values: [cube(rndInt(-10,50),  33,  0)]};
		var cube7  = {key:  7, values: [cube(rndInt(-10,50), -33, 11)]};
		var cube8  = {key:  8, values: [cube(rndInt(-10,50), -22, 11)]};
		var cube9  = {key:  9, values: [cube(rndInt(-10,50), -11, 11)]};
		var cube10 = {key: 10, values: [cube(rndInt(-10,50),   0, 11)]};
		var cube11 = {key: 11, values: [cube(rndInt(-10,50),  11, 11)]};
		var cube12 = {key: 12, values: [cube(rndInt(-10,50),  22, 11)]};
		var cube13 = {key: 13, values: [cube(rndInt(-10,50),  33, 11)]};

		var cube14 = {key: 14, values: [cube(rndInt(-10,50), -33,-11)]};
		var cube15 = {key: 15, values: [cube(rndInt(-10,50), -22,-11)]};
		var cube16 = {key: 16, values: [cube(rndInt(-10,50), -11,-11)]};
		var cube17 = {key: 17, values: [cube(rndInt(-10,50),   0,-11)]};
		var cube18 = {key: 18, values: [cube(rndInt(-10,50),  11,-11)]};
		var cube19 = {key: 19, values: [cube(rndInt(-10,50),  22,-11)]};
		var cube20 = {key: 20, values: [cube(rndInt(-10,50),  33,-11)]};

		threedCtrl.data = [
			cube0,
			cube1,
			cube2,
			cube3,
			cube4,
			cube5,
			cube6,
			cube7,
			cube8,
			cube9,
			cube10,
			cube11,
			cube12,
			cube13,
			cube14,
			cube15,
			cube16,
			cube17,
			cube18,
			cube19,
			cube20,
		];
	}

	function rndInt(min, max){
		return Math.floor(d3.randomUniform(min, max)());
	}

	updateData();

	threedCtrl.updateData = function(){
		updateData();
	};

	function cube(h, x, z){
		var m  =  5;
		var	n  = -5;
		var xn = n+x;
		var xm = m+x;
		var zn = n+z;
		var zm = m+z;

		return [
			{
				name: 'front',
				tl: {x: xn, y: h, z: zn}, tr: {x: xm, y: h, z: zn},
			  	bl: {x: xn, y: n, z: zn}, br: {x: xm, y: n, z: zn}
			},
			{
				name: 'back',
				tl: {x: xn, y: h, z: zm}, tr: {x: xm, y: h, z: zm},
			  	bl: {x: xn, y: n, z: zm}, br: {x: xm, y: n, z: zm}
			},
			{
				name: 'left',
				tl: {x: xn, y: h, z: zn}, tr: {x: xn, y: h, z: zm},
			  	bl: {x: xn, y: n, z: zn}, br: {x: xn, y: n, z: zm}
			},
			{
				name: 'right',
				tl: {x: xm, y: h, z: zn}, tr: {x: xm, y: h, z: zm},
			  	bl: {x: xm, y: n, z: zn}, br: {x: xm, y: n, z: zm}
			},
			{
				name: 'top',
				tl: {x: xn, y: h, z: zn}, tr: {x: xm, y: h, z: zn},
			  	bl: {x: xn, y: h, z: zm}, br: {x: xm, y: h, z: zm}
			},
		];
	}
});
