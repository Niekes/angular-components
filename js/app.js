'use strict';

var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
    .state('home', {
        url: '/',
        controller: 'homeCtrl',
        controllerAs: 'homeCtrl',
        templateUrl: 'partials/home.html',
        data : {
            pageTitle: 'd3 portfolio',
            description: 'by niekes'
        }
    })
    .state('histogram', {
        url: '/histogram',
        controller: 'histogramCtrl',
        controllerAs: 'histogramCtrl',
        templateUrl: 'partials/histogram.html',
        data : {
            showInList: true,
            pageTitle: 'Histogram',
            description: 'for images'
        }
    })
    .state('treemap', {
        url: '/treemap',
        controller: 'treemapCtrl',
        controllerAs: 'treemapCtrl',
        templateUrl: 'partials/treemap.html',
        data : {
            showInList: true,
            pageTitle: 'Treemap',
            description: 'with tranformation to table'
        }
    })
    .state('gauge', {
        url: '/gauge',
        controller: 'gaugeCtrl',
        controllerAs: 'gaugeCtrl',
        templateUrl: 'partials/gauge.html',
        data : {
            showInList: true,
            pageTitle: 'Gauge',
            description: 'with number at the tip of the needle'
        },
    })
    .state('textanimation', {
        url: '/textanimation',
        controller: 'textanimationCtrl',
        controllerAs: 'textanimationCtrl',
        templateUrl: 'partials/textanimation.html',
        data : {
            showInList: true,
            pageTitle: 'Text Animation',
            description: 'interpolation between to numeric values'
        },
    })
    .state('stackedcolumnchart', {
        url: '/stackedcolumnchart',
        controller: 'stackedcolumnchartCtrl',
        controllerAs: 'stackedcolumnchartCtrl',
        templateUrl: 'partials/stackedcolumnchart.html',
        data : {
            showInList: true,
            pageTitle: 'Stacked Column Chart',
            description: 'with negative values'
        }
    })
    .state('piechart', {
        url: '/piechart',
        controller: 'piechartCtrl',
        controllerAs: 'piechartCtrl',
        templateUrl: 'partials/piechart.html',
        data : {
            showInList: true,
            pageTitle: 'Pie Chart',
            description: 'with arc padding and rounded corners'
        }
    })
    .state('scatterplot', {
        url: '/scatterplot',
        controller: 'scatterplotCtrl',
        controllerAs: 'scatterplotCtrl',
        templateUrl: 'partials/scatterplot.html',
        data : {
            showInList: true,
            pageTitle: 'Scatterplot',
            description: 'with curved text'
        }
    });

    $urlRouterProvider.otherwise('/');
});

app.run(function ($rootScope, $state){
    $rootScope.$state = $state;
});
