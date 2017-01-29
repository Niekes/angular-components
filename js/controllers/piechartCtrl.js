'use strict';

app.controller('piechartCtrl', function($interval){

	var $piechartCtrl = this;

	function rndInt(min, max){
		return Math.floor(d3.randomUniform(min, max)());
	}

	var dataSet = [
		[
			{name: 'A', value: rndInt(0,100)},
			{name: 'B', value: rndInt(0,100)},
			{name: 'C', value: rndInt(0,100)},
			{name: 'D', value: rndInt(0,100)},
			{name: 'E', value: rndInt(0,100)},
		],
		[
			{name: 'A', value: rndInt(0,100)},
			{name: 'B', value: rndInt(0,100)},
			{name: 'C', value: rndInt(0,100)},
			{name: 'D', value: rndInt(0,100)},
			{name: 'E', value: rndInt(0,100)},
		],
		[
			{name: 'A', value: rndInt(15,100)},
			{name: 'C', value: rndInt(15,100)},
			{name: 'D', value: rndInt(15,100)},
			{name: 'E', value: rndInt(15,100)},
		],
		[
			{name: 'A', value: rndInt(15,100)},
			{name: 'B', value: rndInt(15,100)},
			{name: 'D', value: rndInt(15,100)},
			{name: 'E', value: rndInt(15,100)},
		],
		[
			{name: 'A', value: rndInt(15,100)},
			{name: 'B', value: rndInt(15,100)},
			{name: 'C', value: rndInt(15,100)},
			{name: 'D', value: rndInt(15,100)},
			{name: 'E', value: rndInt(15,100)},
		],
	];

	var i = 0;
	function updateData(){
		$piechartCtrl.data  = dataSet[(i % dataSet.length)];
		i++;
	}

	updateData();
	$interval(updateData, 2000);
});
