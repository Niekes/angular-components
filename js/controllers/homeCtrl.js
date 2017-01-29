'use strict';

app.controller('homeCtrl', function(){
    this.sites = [
    	{ name: 'Scatterplot', description: 'with curved text', state: 'scatterplot' },
    	{ name: 'Stacked column chart', description: 'with negative values', state: 'stackedcolumnchart' },
    	{ name: 'Pie chart', description: 'Pie chart', state: 'piechart' },
    ];
});
