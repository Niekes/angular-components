'use strict';

app.controller('linechartCtrl', function($scope, $interval, $http){

	var $linechartCtrl = this;
	var parseTime = d3.timeParse('%Y%m%d');

	function row(d){
		return {
			date: parseTime(d.MESS_DATUM_BEGINN.trim()),
			temperature: parseInt(d.LUFTTEMPERATUR),
		};
	}

	function updateData(){

		$http.get('data/berlin-weather.csv', function(res){
			console.log(res);
		});

		// d3.csv('data/berlin-weather.csv', row, function(error, data){
		// 	$linechartCtrl.data = [{key: 'Berlin', values: data}];
		// });
	}

	updateData();

	// var i = $interval(updateData, 5000);

	// $scope.$on('$destroy', function(){
	// 	if(i){
	// 		$interval.cancel(i);
	// 	}
	// });
});
