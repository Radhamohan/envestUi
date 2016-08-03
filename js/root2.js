var rootApp = angular.module('rootApp', ['ngAnimate', 'ui.bootstrap', 'ui.router']);
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
            //'left-middle@existingUser': {
            //  templateUrl: './login2/partial/left-middle.html'
            //},
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
            //'left-middle@newUser': {
            //  templateUrl: './login2/partial/left-middle.html'
            //},
            'right-middle@newUser': {
                templateUrl: './login2/partial/right-middle-new-user.html',
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
    //alert(1);
    $scope.user = {};
    $scope.user.error = true;
    $scope.existingUser = {};
    $scope.existingUser.error = true;

    $scope.active = {
        one: false,
        two: true
    };

    $scope.registerUser = function() {
        $state.go("load");
        $http.post("https://envestment.herokuapp.com/eNvest/UserService/users/registerUser?" +
                "userID=" + $scope.user.email +
                "&password=" + $scope.user.password +
                "&firstName=" + $scope.user.firstName +
                "&lastName=" + $scope.user.lastName)
            .success(function(data, status) {
                if (data.status == "Success") {
                    var qs = "?userKey=" + data.userKey;
                    parent.location = './linkBank/bank.html' + qs;
                } else {
                    $state.go("newUser");
                    $scope.user.error = false;
                }
            });
    };

    $scope.tab2 = function() {
        $("#tab2").attr("active", "true");
    }

    $scope.signIn = function() {
        $state.go("load");
        $http.get("https://envestment.herokuapp.com/eNvest/UserService/users/authenticate?" +
                "userID=" + $scope.existingUser.userName +
                "&password=" + $scope.existingUser.password)
            .success(function(data, status) {
                if (data.status == "Success") {
                    var qs = "?userKey=" + data.userKey;
                    $http.get("https://envestment.herokuapp.com/eNvest/UserAccountService/users/getDashBoard?" +
                            "userKey=" + data.userKey)
                        .success(function(data, status) {
                            $scope.existingUser.errorFlag = true;
                            if (data.accounts.length == 0) {
                                parent.location = './linkBank/bank.html' + qs;
                            } else if (data.accounts.length > 0) {
                                parent.location = './dashboard2/dashboard.html' + qs;
                            } else {
                                $state.go("existingUser");
                                $scope.existingUser.error = false;
                            }
                        });
                } else {
                    $state.go("existingUser");
                    $scope.existingUser.error = false;
                }
            });
    };


    $scope.onMfaSubmit = function() {

    };
});