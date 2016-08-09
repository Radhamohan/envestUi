var userProductApp = angular.module('userProductApp', ['ngAnimate', 'ui.router']);

userProductApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/userProduct');

    $stateProvider

        .state('userProduct', {
        url: '/userProduct',
        views: {
            '': {
                templateUrl: './userProductLayout.html'
            },
            'header@userProduct': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@userProduct': {
                templateUrl: '../footer2.html'
            },
            'middle@userProduct': {
                templateUrl: './partial/products.html'
            }
        }
    })

    .state('load', {
        url: '/load',
        views: {
            '': {
                templateUrl: './profileLayout.html'
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


intializeHeaderController(userProductApp);

userProductApp.controller('userProductController', function($rootScope, $scope, $http, $state) {
    $scope.user = {};
    $scope.user.userKey = getUserKeyOrRedirect(window.location.href, "userKey");

    $http.get("https://envestment.herokuapp.com/eNvest/ProductService/getAvailableUserProducts?" +
            "userKey=" + $scope.user.userKey)
        .success(function(data, status) {
            $scope.products = data;
        });
        
    $scope.goToDashboard = function() {
        parent.location = "../dashboard2/dashboard.html?userKey=" + $scope.user.userKey;
    };

    $scope.formatNumber = function(num1) {        
        return numeral(num1).format('($0,0.00)');
    };
});