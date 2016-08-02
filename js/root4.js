var rootApp = angular.module('rootApp', ['ui.router']);

var regionUrl = '';

rootApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/existingUser');

    $stateProvider

        .state('existingUser', {
        url: '/existingUser',
        views: {
            '': {
                templateUrl: './login/login.html'
            },
            'header@existingUser': {
                templateUrl: './header.html',
                controller: 'headerController'
            },
            'footer@existingUser': {
                templateUrl: './footer.html'
            },
            'left-middle@existingUser': {
                templateUrl: './login4/partial/left-middle.html'
            },
            'right-middle@existingUser': {
                templateUrl: './login4/partial/right-middle-existing-user.html',                
            }
        }
    })


    .state('newUser', {
        url: '/newUser',
        views: {
            '': {
                templateUrl: './login4/login.html'
            },
            'header@newUser': {
                templateUrl: './header.html',
                controller: 'headerController'
            },
            'footer@newUser': {
                templateUrl: './footer.html'
            },
            'left-middle@newUser': {
                templateUrl: './login4/partial/left-middle.html'
            },
            'right-middle@newUser': {
                templateUrl: './login4/partial/right-middle-new-user.html',                
            }
        }
    });
});

rootApp.controller('headerController', function($rootScope, $scope, $http) {
    $scope.headerClick = function() {
        parent.location = '#';
    };
});

rootApp.controller('loginController', function($rootScope, $scope, $http, $state) {
    alert(1);
    $scope.registerUser = function() {        
    };

    $scope.signIn = function() {
    };

    $scope.onMfaSubmit = function() {
    };
});