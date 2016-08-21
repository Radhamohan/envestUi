var rootApp = angular.module('rootApp', ['ngAnimate', 'ui.bootstrap', 'ui.router', 'ngCookies']);
var regionUrl = '';
var activeIndex = '0';

rootApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/existingUser');

    $stateProvider
    
    .state('existingUser', {
        url: '/existingUser',
        views: {
            '': {
                templateUrl: './login2/login.html'
            },
            'header@existingUser': {
                templateUrl: './header.html',
                controller: 'headerController'
            },
            'footer@existingUser': {
                templateUrl: './footer2.html'
            },            
            'right-middle@existingUser': {
                templateUrl: './login2/partial/right-middle-existing-user.html'
            },
        }
    })


    .state('deviceCode', {
        url: '/deviceCode',
        views: {
            '': {
                templateUrl: './login2/login.html'
            },
            'header@deviceCode': {
                templateUrl: './header.html',
                controller: 'headerController'
            },
            'footer@deviceCode': {
                templateUrl: './footer2.html'
            },
            'left-middle@deviceCode': {
                templateUrl: './login2/partial/left-middle.html'
            },
            'right-middle@deviceCode': {
                templateUrl: function($stateParams) {
                    return './login2/partial/left-middle.html';
                }
            }
        }
    })

    .state('load', {
        url: '/load',
        views: {
            '': {
                templateUrl: './login2/login.html'
            },
            'header@load': {
                templateUrl: './header.html',
                controller: 'headerController'
            },
            'footer@load': {
                templateUrl: './footer2.html'
            },
            'right-middle@load': {
                templateUrl: './load.html'
            }
        }
    })


    .state('newUser', {
        url: '/newUser',
        views: {
            '': {
                templateUrl: './login2/login.html'
            },
            'header@newUser': {
                templateUrl: './header.html',
                controller: 'headerController'
            },
            'footer@newUser': {
                templateUrl: './footer2.html'
            },           
            'right-middle@newUser': {
                templateUrl: './login2/partial/right-middle-new-user.html',
            }
        }
    });
});

intializeHeaderController(rootApp);

rootApp.controller('loginController', function($rootScope, $scope, $http, $state, $cookies) {    
    $scope.user = {};
    $scope.user.hideErrorMessage = true;
    $scope.existingUser = {};
    $scope.existingUser.hideErrorMessage = true;

    $scope.active = {
        one: false,
        two: true
    };

    $scope.registerUser = function() {
        $state.go("load");
        $http.post(getBaseWebserviceUrl() + "/UserService/users/registerUser?" +
                "userID=" + $scope.user.email +
                "&password=" + $scope.user.password +
                "&firstName=" + $scope.user.firstName +
                "&lastName=" + $scope.user.lastName)
            .success(function(data, status) {
                if (data.status == "Success") {
                    var qs = "?userKey=" + data.userKey;
                    setCookie($cookies, 'token', data.authToken)
                    parent.location = './linkBank/bank.html' + qs;
                } else {
                    $state.go("newUser");
                    $scope.user.hideErrorMessage = false;
                }
            });
    };

    $scope.tab2 = function() {
        $("#tab2").attr("active", "true");
    };

    $scope.signIn = function() {
        $state.go("load");
        $http.get(getBaseWebserviceUrl() + "/UserService/users/authenticate?" +
                "userID=" + $scope.existingUser.userName +
                "&password=" + $scope.existingUser.password)
            .success(function(data1, status) {
                if (data1.status == "Success") {
                    var qs = "?userKey=" + data1.userKey;
                    setCookie($cookies, 'token', data1.authToken);
                    $http.get(getBaseWebserviceUrl() + "/UserAccountService/users/getDashBoard?" +
                            "userKey=" + data1.userKey, getHeader($cookies))
                        .then(function(response, status) {
                            $scope.existingUser.hideErrorMessage = true;
                            if (response.data.accounts.length == 0) {
                                parent.location = './linkBank/bank.html' + qs;
                            } else if (response.data.accounts.length > 0) {
                                parent.location = './dashboard2/dashboard.html' + qs;
                            } else {
                                $state.go("existingUser");                                
                                $scope.existingUser.hideErrorMessage = false;
                            }
                        }, function(response) {
                            alert(response);
                        });
                } else {
                    $state.go("existingUser");
                    $scope.existingUser.serverError = data1.message;
                    $scope.existingUser.hideErrorMessage = false;
                }
            });
    };


    $scope.onMfaSubmit = function() {

    };
});