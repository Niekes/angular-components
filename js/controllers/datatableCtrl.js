'use strict';

app.controller('datatableCtrl', function($scope, $interval){

	var $datatableCtrl = this;

	function rnd(min, max){
		return Math.floor(d3.randomUniform(min, max)());
	}

	function updateData(){
		$datatableCtrl.data = [
			{name: 'A', values: {val:rnd(0,100),ly:rnd(0,100),pv:rnd(0,100)}},
			{name: 'B', values: {val:rnd(0,100),ly:rnd(0,100),pv:rnd(0,100)}}
		];
	}

	updateData();

	// var i = $interval(function(){
	// 	updateData();
	// }, 500);

	// $scope.$on('$destroy', function(){
	// 	if(i){
	// 		$interval.cancel(i);
	// 	}
	// });
});
