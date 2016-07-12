var info = {
    "accounts": [{
        "_id": "YzzrzBrO9OSzo6BXwAvVuL5dmMKMqkhOoEqeo",
        "_item": "aWWVW4VqGqIdaP495QyOSVLN1nzjLwhXaPDJJ",
        "_user": "bkkVkMVwQwfYmBMy9jzqHQob9O1KwpFaEyLOE",
        "balance": {
            "available": 7205.23,
            "current": 7255.23
        },
        "institution_type": "fake_institution",
        "meta": {
            "name": "Plaid Credit Card",
            "number": "3002"
        },
        "type": "depository",
        "subtype": "checking"
    }, {
        "_id": "pJPM4LMBNQFrOwp0jqEyTwyxJQrQbgU6kq37k",
        "_item": "aWWVW4VqGqIdaP495QyOSVLN1nzjLwhXaPDJJ",
        "_user": "bkkVkMVwQwfYmBMy9jzqHQob9O1KwpFaEyLOE",
        "balance": {
            "available": 9930,
            "current": 2275.58
        },
        "institution_type": "fake_institution",
        "meta": {
            "limit": 12500,
            "name": "Plaid Credit Card",
            "number": "3002"
        },
        "type": "credit"
    }],
    "info": {
        "emails": [{
            "primary": true,
            "type": "personal",
            "data": "kelly.walters30@example.com"
        }],
        "addresses": [{
            "primary": true,
            "data": {
                "zip": "94114",
                "state": "CA",
                "city": "San Francisco",
                "street": "3819 Greenhaven Ln"
            }
        }],
        "phone_numbers": [{
            "primary": true,
            "type": "home",
            "data": "4673956022"
        }],
        "names": [
            "Kelly Walters"
        ]
    },
    "access_token": "xxxxx"
};


var userInfoApp = angular.module('userInfoApp', ['ui.router']);

userInfoApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/load');

    $stateProvider

        .state('verifyInfo', {
        url: '/verifyInfo',
        views: {
            '': {
                templateUrl: './userInfoLayout.html'
            },
            'header@verifyInfo': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@verifyInfo': {
                templateUrl: '../footer.html'
            },
            'middle@verifyInfo': {
                templateUrl: './verifyInfo.html'
            }
        }
    })


    .state('linkNewAccount', {
        url: '/linkNewAccount',
        views: {
            '': {
                templateUrl: './userInfoLayout.html'
            },
            'header@linkNewAccount': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@linkNewAccount': {
                templateUrl: '../footer.html'
            },
            'middle@linkNewAccount': {
                templateUrl: './linkNewAccount.html'
            }
        }
    })

    .state('load', {
        url: '/load',
        views: {
            '': {
                templateUrl: './userInfoLayout.html'
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
    })

    .state('userSetup', {
        url: '/userSetup',
        views: {
            '': {
                templateUrl: './userInfoLayout.html'
            },
            'header@userSetup': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@userSetup': {
                templateUrl: '../footer.html'
            },
            'middle@userSetup': {
                templateUrl: './userSetup.html'
            }
        }
    })

    .state('device', {
        url: '/device',
        views: {
            '': {
                templateUrl: './userInfoLayout.html'
            },
            'header@device': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@device': {
                templateUrl: '../footer.html'
            },
            'middle@device': {
                templateUrl: './device.html'
            }
        }
    })

    .state('editInfo', {
        url: '/editInfo',
        views: {
            '': {
                templateUrl: './userInfoLayout.html'
            },
            'header@editInfo': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@editInfo': {
                templateUrl: '../footer.html'
            },
            'middle@editInfo': {
                templateUrl: './editInfo.html'
            }
        }
    });
});


userInfoApp.controller('headerController', function($rootScope, $scope, $http) {
    $scope.headerClick = function() {
        parent.location = '../';
    };
});

userInfoApp.controller('userInfoController', function($rootScope, $scope, $http, $state) {
    if (window.location.search == '') {
        var queryString = decodeURIComponent(window.location.href);
        queryString = queryString.substring(1);
        var queries = queryString.split("userId=");
        var userId = queries[1];
        $scope.linkAccount = {};
        $scope.linkAccount.userId = userId;
        $state.go('linkNewAccount');
    } else {
        var queryString = decodeURIComponent(window.location.search);
        queryString = queryString.substring(1);

        var queries = queryString.split("&");
        var userName = queries[0].replace("userName=", "");
        var password = queries[1].replace("password=", "");
        var bankName = queries[2].replace("bankName=", "");



        $http.get("https://envestment.herokuapp.com/eNvest/UserService/users/getInfo?userID=" + userName + "&password=" + password + "&bank=" + bankName).success(function(data, status) {
            if (data.responseType == 'device') {
                $scope.mfa = data;
                $state.go('device');
            }
            if (data.responseType == 'userInfo') {                
                $scope.userInfo = data.info;
                $scope.accounts = data.accounts;
                $scope.userInfo.userId = data.userKey
                $scope.userInfo.userName = data.info.emails[0].email;

                $state.go('userSetup');
            }
        });
    }

    //$http.get("http://rest-service.guides.spring.io/greeting").success(function(data, status) {
    //  $scope.userInfo = info;
    //$state.go('userSetup');
    //});

    $scope.openDashboard = function() {
        parent.location = '../dashboard/dashboard.html?userId=' + $scope.userInfo.userId;
    };

    $scope.signIn = function() {
        $http.post("https://envestment.herokuapp.com/eNvest/UserService/users/saveUser?userKey=" + $scope.userInfo.userId + "&userID=" + $scope.userInfo.userName + "&password=" + $scope.userInfo.password).success(function(data, status) {
            $scope.userId = data.id
            $state.go('verifyInfo');
        });
    };

    $scope.saveUserInfo = function() {
        $state.go('verifyInfo');
    };

    $scope.linkMyBank = function() {        
         $http.post("https://envestment.herokuapp.com/eNvest/UserService/users/linkAccount?userKey=" + $scope.linkAccount.userId + "&userID=" + $scope.linkAccount.bankUserName + "&password=" + $scope.linkAccount.bankPassword + "&bank=" + $scope.linkAccount.selectedBank).success(function(data, status) {
            $scope.userId = data.userKey
            parent.location = '../dashboard/dashboard.html?userId=' + data.userKey;
        });
    };
});