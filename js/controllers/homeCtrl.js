'use strict';

app.controller('homeCtrl', function(){
    this.sites = [
    	{ name: 'Scatterplot', description: 'Scatterplot with curved text', url: 'scatterplot' },
    	{ name: 'Stacked Column Chart', description: 'Stacked Column Chart with negative values', url: 'stackedcolumnchart' },
    ];
});
