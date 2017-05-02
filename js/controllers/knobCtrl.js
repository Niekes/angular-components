'use strict';

app.controller('knobCtrl', function($scope, $interval){

	var $knobCtrl = this;
	var data = 0.000000000001;

	function rnd(min, max){
		return d3.randomUniform(min, max)();
	}

	function updateData(val){
		$knobCtrl.data = val;
	}

	updateData(data);

	var i = $interval(function(){
		updateData(rnd(0, 1));
	}, 2500);

	$scope.$on('$destroy', function(){
		if(i){
			$interval.cancel(i);
		}
	});

});
