'use strict';

var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/');

    $stateProvider
    .state('home', {
        url: '/',
        controller: 'masterCtrl',
        templateUrl: 'partials/home.html',
        data : { pageTitle: 'Home' },
    });
});

app.run(function ($rootScope, $state){
    $rootScope.$state = $state;
});
