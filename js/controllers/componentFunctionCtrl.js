'use strict';

app.controller('componentFunctionCtrl', function(){
	var componentFunctionCtrl = this;

	componentFunctionCtrl.counter = 0;

	componentFunctionCtrl.addOne = function(){
		componentFunctionCtrl.counter += 1;
	}

});