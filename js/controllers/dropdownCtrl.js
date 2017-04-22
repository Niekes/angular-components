'use strict';

app.controller('dropdownCtrl', function($scope, $interval){

	var $dropdownCtrl = this;
	var count = 0;

	function rnd(min, max){
		return d3.randomUniform(min, max)();
	}

	function updateData(){

		var a = [
			{name: 'A', children: [{name: 'a.a'},{name: 'a.b'}]},
			{name: 'B', children: [{name: 'b.a'},{name: 'b.c'}]},
			{name: 'D', children: [{name: 'd.a'},{name: 'd.b.'},{name: 'd.d.'},{name: 'd.e.'}]},
		];

		var b = [
			{name: 'A', children: [{name: 'a.a'},{name: 'a.b'}]},
			{name: 'B', children: [{name: 'b.a'},{name: 'b.b'}]},
			{name: 'C', children: [{name: 'c.a'},{name: 'c.b'}]},
			{name: 'D', children: [{name: 'd.a'},{name: 'd.e', children: [{name: 'harry', children:[{name:'Joe'},{name:'billy'}]}]}]},
			{name: 'E', children: [{name: 'e.a', children: [{name:'e.a'}]} ]},
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
