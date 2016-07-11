var rootApp = angular.module('rootApp', ['ui.router']);

rootApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/existingUser');
    
    $stateProvider
    
    .state('existingUser', {
            url: '/existingUser',            
            views: {
                '': {templateUrl: './login/login.html'},
                'header@existingUser': {
                                            templateUrl: './header.html',
                                            controller: 'headerController'
                                        },
                'footer@existingUser': {templateUrl: './footer.html'},
                'left-middle@existingUser': {templateUrl: './login/left-middle.html'},
                'right-middle@existingUser': {
                                                templateUrl: './login/right-middle-existing-user.html',                                                
                                                controller: 'loginController'
                                             }                
            }
    })
    
    
    .state('deviceCode', {
            url: '/deviceCode',            
            views: {
                '': {templateUrl: './login/login.html'},
                'header@mfa': {
                                            templateUrl: './header.html',
                                            controller: 'headerController'
                                        },
                'footer@mfa': {templateUrl: './footer.html'},
                'left-middle@mfa': {templateUrl: './login/left-middle.html'},
                'right-middle@mfa': {
                                                templateUrl: './login/right-middle-mfa-device-code.html',                                                
                                                controller: 'loginController'
                                             }                
            }
    })
    
    
    .state('newUser', {
            url: '/newUser',            
            views: {
                '': { templateUrl: './login/login.html' },
                'header@newUser': {
                                    templateUrl: './header.html',
                                    controller: 'headerController'
                                 },
                'footer@newUser': {templateUrl: './footer.html'},
                'left-middle@newUser': {templateUrl: './login/left-middle.html'},
                'right-middle@newUser': {
                                            templateUrl: './login/right-middle-new-user.html',
                                            controller: 'loginController'
                                        }                
            }
    });
});

rootApp.controller('headerController', function($rootScope, $scope, $http) {
    $scope.headerClick = function() {        
        parent.location = '#';
    };
});

rootApp.controller('loginController', function($rootScope, $scope, $http) {
    $scope.registerUser = function() { 
        var qs = "?userName=" + $scope.bankUserName + "&password=" + $scope.bankPassword + "&bankName=" + $scope.selectedBank;        
        parent.location = './userInfo/userInfo.html' + qs;
    };
    
     $scope.signIn = function() {              
        $http.get("http://localhost:8080/eNvestS/eNvest/UserService/users/authenticate?userID=" + $scope.userName + "&password=" + $scope.password).success(function(data, status) {
            $scope.userId = data.userKey;
            parent.location = './dashboard/dashboard.html?userId=' + $scope.userId;
        });        
    };
    
    $scope.onMfaSubmit = function() {
        
    };
});