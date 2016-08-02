var rootApp = angular.module('rootApp', ['ui.router']);

var regionUrl = '';

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
                                                //controller: 'loginController'
                                             }                
            }
    })
    
    
    .state('deviceCode', {
            url: '/deviceCode',            
            views: {
                '': {templateUrl: './login/login.html'},
                'header@deviceCode': {
                                            templateUrl: './header.html',
                                            controller: 'headerController'
                                        },
                'footer@deviceCode': {templateUrl: './footer.html'},
                'left-middle@deviceCode': {templateUrl: './login/left-middle.html'},
                'right-middle@deviceCode': {
                                                templateUrl: function($stateParams) {
                                                    return regionUrl;
                                                }//,
                                                //regionUrl,//'./login/right-middle-mfa-device-code.html',                                                
                                                //controller: 'loginController'
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
                                            //controller: 'loginController'
                                        }                
            }
    });
});

rootApp.controller('headerController', function($rootScope, $scope, $http) {
    $scope.headerClick = function() {        
        parent.location = '#';
    };
});

rootApp.controller('loginController', function($rootScope, $scope, $http, $state, $stateParams) {
    $stateParams.test = {};
    $scope.registerUser = function() {
       
       
        //regionUrl = './login/right-middle-existing-user.html';
        // $state.go('deviceCode1') ; 
        var qs = "?userName=" + $scope.bankUserName + "&password=" + $scope.bankPassword + "&bankName=" + $scope.selectedBank;        
        parent.location = './userInfo/userInfo.html' + qs;
    };
    
     $scope.signIn = function() {
         $scope.test = {};
         $scope.test.url = './login/right-middle-mfa-device-code.html';
         
       regionUrl = './login/right-middle-mfa-device-code.html';
        $stateParams.test.url = './login/right-middle-mfa-device-code.html';
        $state.go('deviceCode');     
        //$http.get("http://localhost:8080/eNvestS/eNvest/UserService/users/authenticate?userID=" + $scope.userName + "&password=" + $scope.password).success(function(data, status) {
          //  $scope.userId = data.userKey;
            //parent.location = './dashboard/dashboard.html?userId=' + $scope.userId;
        //});        
    };
    
    $scope.onMfaSubmit = function() {
        
    };
});