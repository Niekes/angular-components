'use strict';

app.controller('piechartCtrl', function($scope, $interval){

	var $piechartCtrl = this;
	var al = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

	function rnd(min, max){
		return d3.randomUniform(min, max)();
	}

	function generateData(){
		var data = [];
		var _count = rnd(1, al.length/2);
		for (var i = 0; i < _count; i++) {
			data.push({
				name: al[i].toUpperCase(), value: rnd(0,100)
			});
		}
		return data;
	}

	function updateData(){
		$piechartCtrl.data = generateData();
	}

	updateData();

	var i = $interval(updateData, 5000);

	$scope.$on('$destroy', function(){
		if(i){
			$interval.cancel(i);
		}
	});

});
