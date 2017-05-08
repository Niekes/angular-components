'use strict';

app.controller('threedCtrl', function($scope, $interval){

	var threedCtrl = this;
	var alpha = 0;

	function updateData(){
		alpha += Math.PI/180;
		threedCtrl.data = alpha;
	}

	updateData();

	var i = $interval(updateData, 10);

	$scope.$on('$destroy', function(){
		if(i){
			$interval.cancel(i);
		}
	});

});
