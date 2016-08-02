var transactionsApp = angular.module('transactionsApp', ['ui.router']);

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
                templateUrl: './summary.html',
                controller: 'transactionsController'
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
                templateUrl: './listTransactions.html',
                controller: 'transactionsController'
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


transactionsApp.controller('headerController', function($rootScope, $scope, $http, $state) {
    $scope.headerClick = function() {
        parent.location = '../';
    };
});

function getTransactions(data, accountId) {
    var transactions = [];
    for (i = 0; i < data.transaction.length; i++) {
        if (data.transaction[i]._account == accountId) {
            data.transaction[i].amount *= -1;
            transactions.push(data.transaction[i])
        }
    }
    return transactions;
}

transactionsApp.controller('transactionsController', function($rootScope, $scope, $http) {

    var queryString = decodeURIComponent(window.location.href);
    queryString = queryString.substring(1);
    
    var queries = queryString.split("?");
    var queries2 = queries[1].split("&");
    var accountId = queries2[0].replace("accountId=", "");
    var userId = queries2[1].replace("userId=", "");
    $http.get("http://localhost:8080/eNvestS/eNvest/UserAccountService/users/transactions?userKey=" + userId).success(function(data, status) {
        $scope.transactions = getTransactions(data, accountId);
        $scope.accountId = 'QPO8Jo8vdDHMepg41PBwckXm4KdK1yUdmXOwK';
    });

    $scope.getInterestPaid = function() {        
        var date = null;
        var num = 0;
        angular.forEach($scope.transactions, function(transaction) {
            
            if (transaction.category != null && transaction.category[0] == "Interest")
            {
                num += transaction.amount;
                date = transaction.date;
            }
        });
        if(num == 0)  return $scope.formatNumber(num);
        
        return $scope.formatNumber(num) + '  (since ' + date[2] + '/' + date[1] + '/' + date[0] + ' )';
    };

    $scope.getBankFees = function() {        
        var num = 0;
        angular.forEach($scope.transactions, function(transaction) {
            if (transaction.category != null && transaction.category[0] == "Bank Fees")
                num += transaction.amount;
        });
        return $scope.formatNumber(num);
    };

    $scope.getInflows = function() {
        var num = 0;
        angular.forEach($scope.transactions, function(transaction) {
            if (transaction.amount > 0)
                num += transaction.amount;
        });
        return $scope.formatNumber(num);
    };

    $scope.getOutflows = function() {
        var num = 0;
        angular.forEach($scope.transactions, function(transaction) {
            if (transaction.amount < 0)
                num += transaction.amount;
        });
        return $scope.formatNumber(num);
    };

    $scope.formatNumber = function(num) {
        return numeral(num).format('($0,0.00)');
        //if (num < 0)
          //  return '$ (' + num + ')';
        //return '$ ' + num.toFixed(2);
    };

    $http.get("http://rest-service.guides.spring.io/greeting").success(function(data, status) {
        $scope.transactions1 = [{
            date: '03/06/16',
            category: 'Interest',
            amount: '.01'
        }, {
            date: '03/06/16',
            category: 'Bank Fees',
            amount: '10'
        }];

        $scope.summaries = [{
                accountNo: '234',
                bankFees: '45',
                interest: '2'
            }, {
                accountNo: '676',
                bankFees: '65',
                interest: '3'
            },

        ];
    });
});