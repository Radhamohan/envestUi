var linkBankApp = angular.module('linkBankApp', ['ngAnimate', 'ui.router', 'ngCookies']);

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

    .state('device', {
        url: '/device',
        views: {
            '': {
                templateUrl: './bankLayout.html'
            },
            'header@device': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@device': {
                templateUrl: '../footer.html'
            },
            'middle@device': {
                templateUrl: './partial/device.html'
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

intializeHeaderController(linkBankApp);

linkBankApp.controller('linkBankController', function($rootScope, $scope, $http, $state, $cookies) {
    $scope.user = {};
    $scope.bankLogin = {};
    $scope.bankLogin.hideErrorMessage = true;

    $scope.user.userKey = getUserKeyOrRedirect(window.location.href, "userKey");

    $scope.headerClick = function() {
        parent.location = '../';
    };

    $scope.selectBank = function(name) {
        $scope.bankLogin.name = name;
        $state.go('bankCredential');
    };


    $scope.linkAccount = function() {
        if ($scope.bankLogin.name == null || $scope.bankLogin.name == undefined) {
            $state.go('selectBank');
            return;
        }

        $http.post(getBaseWebserviceUrl() + "/UserService/users/linkAccount?" +
                "userKey=" + $scope.user.userKey +
                "&userID=" + $scope.bankLogin.userName +
                "&password=" + $scope.bankLogin.password +
                "&bank=" + $scope.bankLogin.name, null, getHeader($cookies))
            .then(function(response, status) {
                var data = response.data;
                if (data.status == "failure" || data.status == "Failure"){
                    $scope.bankLogin.serverError = data.message;
                    $scope.bankLogin.hideErrorMessage = false;
                    return;
                }
                if (data.type == 'device')
                    $state.go('device');
                else {
                    gotoDashboard($scope.user.userKey);                    
                }
            }, function(response) {
                alert(response);
            });
    };

    $scope.submitMfa = function() {
        if ($scope.bankLogin.name == null || $scope.bankLogin.name == undefined) {
            $state.go('selectBank');
            return;
        }

        $http.post(getBaseWebserviceUrl() + "/UserService/users/submitMFA?" +
                "userKey=" + $scope.user.userKey +
                "&mfa=" + $scope.bankLogin.code +
                "&bank=" + $scope.bankLogin.name, null, getHeader($cookies))
            .then(function(data, status) {
                if (data.status == "failure" || data.status == "Failure")
                    $scope.bankLogin.hideErrorMessage = false;
                else {
                     gotoDashboard($scope.user.userKey);                    
                }
            }, function(response) {
                handleError();
            });
    };
});