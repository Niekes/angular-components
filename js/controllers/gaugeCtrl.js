'use strict';

app.controller('gaugeCtrl', function($interval){

	var $gaugeCtrl = this;
	var data = 0.000000000001;

	function rnd(min, max){
		return d3.randomUniform(min, max)();
	}

	function updateData(val){
		$gaugeCtrl.data = val;
	}

	updateData(data);
	$interval(function(){
		updateData(rnd(0, 1));
	}, 2500);
});
