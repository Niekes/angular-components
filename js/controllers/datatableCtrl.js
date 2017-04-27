'use strict';

app.controller('datatableCtrl', function($scope, $interval){

	var $datatableCtrl = this;
	var al = 'abcdefghijklmnopqrstuvwxyz'.split('');

	function rnd(min, max){
		return d3.randomUniform(min, max)();
	}

	function updateData(){
		var data = [];
		var _count = rnd(1, al.length);
		for (var i = 0; i < _count; i++) {
			data.push({
				name: al[i].toUpperCase(), val: rnd(0,100), ly: rnd(0,100), pv: rnd(0,100), ca: rnd(0,100), kp: rnd(0,100),
			});
		}
		$datatableCtrl.data = data.sort(function(a, b){ return b.val - a.val; });
	}

	updateData();

	var i = $interval(function(){
		updateData();
	}, 10000);

	$scope.$on('$destroy', function(){
		if(i){
			$interval.cancel(i);
		}
	});
});
