'use strict';

app.controller('threedCtrl', function($scope, $interval){

	var threedCtrl = this;

	var data = [
		{ sp: {x: -1, y:  1, z: -1}, ep: {x:  1, y:  1, z: -1} },
		{ sp: {x: -1, y: -1, z: -1}, ep: {x:  1, y: -1, z: -1} },
		{ sp: {x:  1, y: -1, z: -1}, ep: {x:  1, y:  1, z: -1} },
		{ sp: {x: -1, y: -1, z: -1}, ep: {x: -1, y:  1, z: -1} },
		{ sp: {x: -1, y:  1, z:  1}, ep: {x:  1, y:  1, z:  1} },
		{ sp: {x: -1, y: -1, z:  1}, ep: {x:  1, y: -1, z:  1} },
		{ sp: {x:  1, y: -1, z:  1}, ep: {x:  1, y:  1, z:  1} },
		{ sp: {x: -1, y: -1, z:  1}, ep: {x: -1, y:  1, z:  1} },
		{ sp: {x: -1, y: -1, z:  1}, ep: {x: -1, y: -1, z: -1} },
		{ sp: {x:  1, y: -1, z:  1}, ep: {x:  1, y: -1, z: -1} },
		{ sp: {x: -1, y:  1, z:  1}, ep: {x: -1, y:  1, z: -1} },
		{ sp: {x:  1, y:  1, z:  1}, ep: {x:  1, y:  1, z: -1} }
	];

	function updateData(){
		threedCtrl.data = randomizeData();
	}

	function randomizeData(){
		var e = angular.copy(data);
		var r = rndInt(5, 15);
		e.forEach(function(p){
			p.ep.x *= r;
			p.ep.y *= r;
			p.ep.z *= r;
			p.sp.x *= r;
			p.sp.y *= r;
			p.sp.z *= r;
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
