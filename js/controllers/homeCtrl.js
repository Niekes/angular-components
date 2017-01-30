'use strict';

app.controller('homeCtrl', function($state){

	this.sites = $state.get().filter(function(site){
		return site.data ? site.data.showInList : false;
	});

});
