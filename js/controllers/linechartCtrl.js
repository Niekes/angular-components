'use strict';

app.controller('linechartCtrl', function($interval){

	var $linechartCtrl = this;

	function rndInt(min, max){
		return Math.floor(d3.randomUniform(min, max)());
	}

	function row(d){
		return {
			date: d.MESS_DATUM_BEGINN.trim(),
			temperature: parseInt(d.LUFTTEMPERATUR),
		};
	}

	function updateData(){

		$linechartCtrl.data = [
			{key: 'A', values: [{x: '20111001', y: rndInt(0,10)},{x: '20111002', y: rndInt(0,10)},{x: '20111003', y: rndInt(0,10)},{x: '20111004', y: rndInt(0,10)}]},
			{key: 'B', values: [{x: '20111001', y: rndInt(0,10)},{x: '20111002', y: rndInt(0,10)},{x: '20111003', y: rndInt(0,10)},{x: '20111004', y: rndInt(0,10)}]},
			{key: 'C', values: [{x: '20111001', y: rndInt(0,10)},{x: '20111002', y: rndInt(0,10)},{x: '20111003', y: rndInt(0,10)},{x: '20111004', y: rndInt(0,10)}]},
			{key: 'D', values: [{x: '20111001', y: rndInt(0,10)},{x: '20111002', y: rndInt(0,10)},{x: '20111003', y: rndInt(0,10)},{x: '20111004', y: rndInt(0,10)}]},
		];


		d3.csv('data/berlin-weather.csv', row, function(d){
			console.log(d);
		});
	}

	updateData();

	$interval(updateData, 5000);
});
