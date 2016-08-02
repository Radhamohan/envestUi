var linkBankApp = angular.module('linkBankApp', ['ngAnimate', 'ui.router']);

linkBankApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/selectBank');

    $stateProvider

        .state('selectBank', {
        url: '/selectBank',
        views: {
            '': {
                templateUrl: './bankLayout.html'
            },
            'header@selectBank': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@selectBank': {
                templateUrl: '../footer.html'
            },
            'middle@selectBank': {
                templateUrl: './partial/select-bank.html'
            }
        }
    })

    .state('bankCredential', {
        url: '/bankCredential',
        views: {
            '': {
                templateUrl: './bankLayout.html'
            },
            'header@bankCredential': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@bankCredential': {
                templateUrl: '../footer.html'
            },
            'middle@bankCredential': {
                templateUrl: './partial/bank-credential.html'
            }
        }
    })

    .state('load', {
        url: '/load',
        views: {
            '': {
                templateUrl: './dashboardLayout.html'
            },
            'header@load': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@load': {
                templateUrl: '../footer.html'
            },
            'middle@load': {
                templateUrl: '../load.html'
            }
        }
    });
});

linkBankApp.controller('headerController', function($rootScope, $scope, $http) {
    $scope.headerClick = function() {
        parent.location = '../';
    };
});


linkBankApp.controller('linkBankController', function($rootScope, $scope, $http, $state) {
    $scope.user = {};
    $scope.bankLogin = {};
    
    $scope.user.userKey = getQueryStringKeyValue(window.location.href, "userKey");    

    $scope.headerClick = function() {
        parent.location = '../';
    };

    $scope.selectBank = function(name) {        
        $scope.bankLogin.name = name;        
        $state.go('bankCredential');        
    };

    $scope.linkAccount = function() {
        $http.post("https://envestment.herokuapp.com/eNvest/UserService/users/linkAccount?" +
            "userKey=" + $scope.user.userKey +
            "&userID=" + $scope.bankLogin.userName +
            "&password=" + $scope.bankLogin.password +
            "&bank=" + $scope.bankLogin.name)
            .success(function(data, status) {
                parent.location = "../dashboard2/dashboard.html?userKey=" + $scope.user.userKey;
        });
    };
});