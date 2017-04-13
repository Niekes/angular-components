'use strict';

app.controller('textanimationCtrl', function($scope, $interval){

	var $textanimationCtrl = this;
	var limit = 1000000;

	function rndInt(min, max){
		return Math.floor(d3.randomUniform(min, max)());
	}

	function updateData(){
		$textanimationCtrl.data  = [rndInt(-limit,limit), rndInt(-limit,limit), rndInt(-limit,limit)];
	}

	updateData();

	var i = $interval(updateData, 5000);

	$scope.$on('$destroy', function(){
		if(i){
			$interval.cancel(i);
		}
	});
});
