'use strict';

app.controller('dropdownCtrl', function($scope, $interval){

	var $dropdownCtrl = this;
	var count = 0;

	function rnd(min, max){
		return d3.randomUniform(min, max)();
	}

	function updateData(){

		var a = [
			{selected: false, name: 'A', children: [{selected: false, name: 'a.a'},{selected: false, name: 'a.b'}]},
			{selected: false, name: 'B', children: [{selected: false, name: 'b.a'},{selected: false, name: 'b.c'}]},
			{selected: false, name: 'D', children: [{selected: false, name: 'd.a'},{selected: false, name: 'd.b.'},{selected: false, name: 'd.d.'},{selected: true, name: 'd.e.'}]},
		];

		var b = [
			{selected: false, name: 'A', children: [{selected: false, name: 'a.a'},{selected: false, name: 'a.b'}]},
			{selected: true, name: 'B', children: [{selected: false, name: 'b.a'},{selected: false, name: 'b.b'}]},
			{selected: false, name: 'C', children: [{selected: false, name: 'c.a'},{selected: false, name: 'c.b'}]},
			{selected: false, name: 'D', children: [{selected: true, name: 'd.a'},{selected: false, name: 'd.e', children: [{selected: false, name: 'harry', children:[{selected: false, name:'Joe'},{selected: false, name:'billy'}]}]}]},
			{selected: false, name: 'E', children: [{selected: false, name: 'e.a', children: [{selected: false, name:'e.a'}]} ]},
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
