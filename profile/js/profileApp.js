var profileApp = angular.module('profileApp', ['ngAnimate', 'ui.router', 'ngCookies']);

profileApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/profile');

    $stateProvider

        .state('profile', {
        url: '/profile',
        views: {
            '': {
                templateUrl: './profileLayout.html'
            },
            'header@profile': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@profile': {
                templateUrl: '../footer2.html'
            },
            'middle@profile': {
                templateUrl: './partial/basicInformation.html'
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


intializeHeaderController(profileApp);

profileApp.controller('profileController', function($rootScope, $scope, $http, $state, $cookies) {
    alert(getCookie($cookies, 'test'));
    $scope.profile = {};
    $scope.profile.userKey = getUserKeyOrRedirect(window.location.href, "userKey");

    $http.get("https://envestment.herokuapp.com/eNvest/UserAccountService/users/getUserProfile?" +
            "userKey=" + $scope.profile.userKey)
        .success(function(data, status) {
            $scope.profile = data;
        });
        
    $http.get("https://envestment.herokuapp.com/eNvest/UserAccountService/users/accounts?" + 
            "userKey=" + $scope.profileuserKey)
            .success(function(data, status) {
                
            });

    $scope.formatNumber = function(num1) {
        num1 = num1 * -1;
        return numeral(num1).format('($0,0.00)');
    };

    $scope.getValues = function(category) {
        var values = [];
        if ($scope.profile.profile != null) {
            angular.forEach($scope.profile.profile, function(p) {
                if(p.type == category)
                    values.push(p);          
            });
        }
        return values;
    }
});