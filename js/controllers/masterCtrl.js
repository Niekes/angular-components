'use strict';

app.controller('masterCtrl', function($rootScope, $timeout, $window){

	var tm;
	angular.element($window).bind('resize', function(){
		$timeout.cancel(tm);
		tm = $timeout(function(){
			$rootScope.$emit('window:resize');
		}, 1000);
   });
});
