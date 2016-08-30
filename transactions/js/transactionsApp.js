var transactionsApp = angular.module('transactionsApp', ['ngAnimate', 'ui.router', 'ngCookies']);

transactionsApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/listTransactions');

    $stateProvider

        .state('summary', {
        url: '/summary',
        views: {
            '': {
                templateUrl: './transactionsLayout.html'
            },
            'header@summary': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@summary': {
                templateUrl: '../footer.html'
            },
            'middle@summary': {
                templateUrl: './partial/summary.html'
            }
        }
    })

    .state('listTransactions', {
        url: '/listTransactions',
        views: {
            '': {
                templateUrl: './transactionsLayout.html'
            },
            'header@listTransactions': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@listTransactions': {
                templateUrl: '../footer.html'
            },
            'middle@listTransactions': {
                templateUrl: './partial/listTransactions.html'
            }
        }
    })

    .state('load', {
        url: '/load',
        views: {
            '': {
                templateUrl: './transactionsLayout.html'
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

intializeHeaderController(transactionsApp);


function getTransactions(data, accountId) {
    var transactions = [];
    for (i = 0; i < data.transaction.length; i++) {
        //if (data.transaction[i]._account == accountId) {
            data.transaction[i].amount *= -1;
            transactions.push(data.transaction[i])
        //}
    }
    return transactions;
}

transactionsApp.controller('transactionsController', function($rootScope, $scope, $http, $state, $cookies) { 
    $scope.transactions = {};   
    $scope.transactions.userKey = getUserKeyOrRedirect(window.location.href, "userKey");
    //var queryString = decodeURIComponent(window.location.href);
    //queryString = queryString.substring(1);

    //var queries = queryString.split("?");
    //var queries2 = queries[1].split("&");
    //var accountId = queries2[0].replace("accountId=", "");
    //var userId = queries2[1].replace("userId=", "");
    
    $http.get(getBaseWebserviceUrl() + "/UserAccountService/users/transactions?" +
        "userKey=" + $scope.transactions.userKey, getHeader($cookies))
        .then(function(data, status) {
            $scope.transactions = getTransactions(data.data, 0);        
    }, function(respomse) {handleError();});    

    $scope.formatNumber = function(num) {
        return numeral(num).format('($0,0.00)');        
    };    
});