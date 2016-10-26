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
    .state('switch', {
        url: '/switch',
        controller: 'switchCtrl',
        controllerAs: 'switchCtrl',
        templateUrl: 'partials/switch.html',
        data : { pageTitle: 'Switch' },
    })
    .state('blurelement', {
        url: '/blurelement',
        controller: 'blurElementCtrl',
        controllerAs: 'blurElementCtrl',
        templateUrl: 'partials/blur-element.html',
        data : { pageTitle: 'Blur Element' },
    });

    $urlRouterProvider.otherwise('/');
});

app.run(function ($rootScope, $state){
    $rootScope.$state = $state;
});
