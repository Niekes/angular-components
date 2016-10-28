'use strict';

app.controller('changeListenerCtrl', function(){

	this.dataChanged = false;

	this.change = function(){
		this.dataChanged = !this.dataChanged
	}

 });