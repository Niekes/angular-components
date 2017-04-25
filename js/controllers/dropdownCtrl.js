'use strict';

app.controller('dropdownCtrl', function($scope, $interval){

	var $dropdownCtrl = this;
	var count = 0;

	function rnd(min, max){
		return d3.randomUniform(min, max)();
	}

	function updateData(){

		var a = [
			{expand: true, name: 'A', children: [{expand: true, name: 'a.a'},{expand: true, name: 'a.b'}]},
			{expand: true, name: 'B', children: [{expand: true, name: 'b.a'},{expand: true, name: 'b.c'}]},
			{expand: true, name: 'D', children: [{expand: true, name: 'd.a'},{expand: true, name: 'd.b.'},{expand: true, name: 'd.d.'},{expand: true, name: 'd.e.'}]},
		];

		var b = [
			{expand: true, name: 'A', children: [{expand: true, name: 'a.a'},{expand: true, name: 'a.b'}]},
			{expand: true, name: 'B', children: [{expand: true, name: 'b.a'},{expand: true, name: 'b.b'}]},
			{expand: true, name: 'C', children: [{expand: true, name: 'c.a'},{expand: true, name: 'c.b'}]},
			{expand: true, name: 'D', children: [{expand: true, name: 'd.a'},{expand: true, name: 'd.e', children: [{expand: true, name: 'harry', children:[{expand: true, name:'Joe'},{expand: true, name:'billy'}]}]}]},
			{expand: true, name: 'E', children: [{expand: true, name: 'e.a', children: [{expand: true, name:'e.a'}]} ]},
		];

		$dropdownCtrl.data = count % 2 !== 0 ? a : b;
		count++;
	}

	updateData();

	// var i = $interval(function(){
	// 	updateData();
	// }, 5000);

	// $scope.$on('$destroy', function(){
	// 	if(i){
	// 		$interval.cancel(i);
	// 	}
	// });
});
