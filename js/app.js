'use strict';

var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
    .state('home', {
        url: '/',
        controller: 'homeCtrl',
        controllerAs: 'homeCtrl',
        templateUrl: 'partials/home.html',
        data : { pageTitle: 'Home' }
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
            description: 'Pie chart'
        }
    })
    .state('textanimation', {
        url: '/textanimation',
        controller: 'textanimationCtrl',
        controllerAs: 'textanimationCtrl',
        templateUrl: 'partials/textanimation.html',
        data : {
            showInList: true,
            pageTitle: 'Text Animation',
            description: 'interpolate between two numeric values'
        },
    })
    .state('gauge', {
        url: '/gauge',
        controller: 'gaugeCtrl',
        controllerAs: 'gaugeCtrl',
        templateUrl: 'partials/gauge.html',
        data : {
            showInList: true,
            pageTitle: 'Gauge',
            description: 'Gauge'
        },
    });

    $urlRouterProvider.otherwise('/');
});

app.run(function ($rootScope, $state){
    $rootScope.$state = $state;
});
