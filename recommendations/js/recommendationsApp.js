var recommendationsApp = angular.module('recommendationsApp', ['ui.router']);

recommendationsApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/graph');
    
    $stateProvider
    
    .state('graph', {
            url: '/graph',
            views: {
                '': {templateUrl: './recommendationsLayout.html'},
                'header@graph': {
                                        templateUrl: '../header.html',
                                        controller: 'headerController'
                                     },
                'footer@graph': {templateUrl: '../footer.html'},                
                'middle@graph': {
                                        templateUrl: './graph.html',
                                        controller: 'recommendationsController'
                                }
            }
    })
    
    .state('load', {
            url: '/load',
            views: {
                '': {templateUrl: './recommendationsLayout.html'},
                'header@load': {
                                        templateUrl: '../header.html',
                                        controller: 'headerController'
                                },
                'footer@load': {templateUrl: '../footer.html'},                
                'middle@load': {templateUrl: '../load.html'}
            }
    });
});


recommendationsApp.controller('headerController', function($rootScope, $scope, $http) {
    $scope.headerClick = function() {        
        parent.location = '../';
    };
});

recommendationsApp.controller('recommendationsController', function($rootScope, $scope, $http, $state) {
    
});