'use strict';

var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/');

    $stateProvider
    .state('home', {
        url: '/',
        controller: 'homeCtrl',
        controllerAs: 'homeCtrl',
        templateUrl: 'partials/home.html',
        data : { pageTitle: 'Home' },
    })
    .state('switch', {
        url: '/switch',
        controller: 'switchCtrl',
        controllerAs: 'switchCtrl',
        templateUrl: 'partials/switch.html',
        data : { pageTitle: 'Switch' },
    });
});

app.run(function ($rootScope, $state){
    $rootScope.$state = $state;
});
