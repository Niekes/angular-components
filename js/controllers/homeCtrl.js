'use strict';

app.controller('homeCtrl', function(){

	var baseURL = 'https://niekes.github.io/angular-components/#/';

    this.title = 'HOME';

    this.sites = [
    	{ name: 'Switch', url: baseURL, description: 'A pure CSS Switch (with optional Text)' }
    ];

});
