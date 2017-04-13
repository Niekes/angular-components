'use strict';

app.controller('stackedcolumnchartCtrl', function($scope, $interval){

	var $stackedcolumnchartCtrl = this;
	var al = 'abcdefghijklmnopqrstuvwxyz'.split('');

	function rndInt(min, max){
		return Math.floor(d3.randomUniform(min, max)());
	}

	function updateData(){

		var data = [];

		for (var i = 0; i <= rndInt(2, 26); i++) {
			data.push({
				name: al[i],
				values: [
					{name : '1', value: rndInt(-100, 200)},
					{name : '2', value: rndInt(-100, 200)},
					{name : '3', value: rndInt(-100, 200)},
					{name : '4', value: rndInt(-100, 200)},
				]
			});
		}

		$stackedcolumnchartCtrl.data = data;
	}

	updateData();

	var i = $interval(updateData, 5000);

	$scope.$on('$destroy', function(){
		if(i){
			$interval.cancel(i);
		}
	});
});
