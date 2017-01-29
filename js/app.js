'use strict';

var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
    .state('home', {
        url: '/',
        controller: 'homeCtrl',
        controllerAs: 'homeCtrl',
        templateUrl: 'partials/home.html',
        data : { pageTitle: 'Home' },
    })
    .state('scatterplot', {
        url: '/scatterplot',
        controller: 'scatterplotCtrl',
        controllerAs: 'scatterplotCtrl',
        templateUrl: 'partials/scatterplot.html',
        data : { pageTitle: 'Scatterplot' },
    })
    .state('stackedcolumnchart', {
        url: '/stackedcolumnchart',
        controller: 'stackedcolumnchartCtrl',
        controllerAs: 'stackedcolumnchartCtrl',
        templateUrl: 'partials/stackedcolumnchart.html',
        data : { pageTitle: 'Stacked Column Chart' },
    })
    .state('piechart', {
        url: '/piechart',
        controller: 'piechartCtrl',
        controllerAs: 'piechartCtrl',
        templateUrl: 'partials/piechart.html',
        data : { pageTitle: 'Pie Chart' },
    });

    $urlRouterProvider.otherwise('/');
});

app.run(function ($rootScope, $state){
    $rootScope.$state = $state;
});
