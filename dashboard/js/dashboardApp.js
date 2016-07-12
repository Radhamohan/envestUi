var dashboardApp = angular.module('dashboardApp', ['ui.router']);

dashboardApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/accounts');

    $stateProvider

        .state('accounts', {
        url: '/accounts',
        views: {
            '': {
                templateUrl: './dashboardLayout.html'
            },
            'header@accounts': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@accounts': {
                templateUrl: '../footer.html'
            },
            'middle@accounts': {
                templateUrl: './accounts.html'
            }
        }
    })

    .state('transferExisting', {
        url: '/transferExisting',
        views: {
            '': {
                templateUrl: './dashboardLayout.html'
            },
            'header@transferExisting': {
                templateUrl: '../header.html',
                controller: 'headerController'
            },
            'footer@transferExisting': {
                templateUrl: '../footer.html'
            },
            'middle@transferExisting': {
                templateUrl: './transferExisting.html'
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

dashboardApp.controller('headerController', function($rootScope, $scope, $http) {
    $scope.headerClick = function() {
        parent.location = '../';
    };
});

// To be removed
var getRandomSpan = function() {
    return Math.floor((Math.random() * 4) + 1);
}

var currentYields = [0.02, 0.03, 0.04, 0.02, 0.03];
var recommendedYields = [0.9, 1.0, 1.1, 1.2, 1.25];


function getAccounts(data) {
    for (i = 0; i < data.accounts.length; i++) {
        data.accounts[i]['yield'] = currentYields[getRandomSpan()];
    }
    return data.accounts;
}
// To be removed

dashboardApp.controller('dashboardController', function($rootScope, $scope, $http, $state) {
    var queryString = decodeURIComponent(window.location.href);
    queryString = queryString.substring(1);

    var queries = queryString.split("?");
    var userId = queries[1].replace("userId=", "").split("#")[0];
    $scope.userId = userId;
    
    $http.get("https://envestment.herokuapp.com/eNvest/UserAccountService/users/accounts?userKey=" + $scope.userId).success(function(data, status) {
        $scope.accounts = data.accounts;//getAccounts(data);
    });

    $scope.accounts1 = [{
        accountNo: '123',
        accountType: 'Checking',
        balance: '50000',
        bankName: 'Chase'
    }, {
        accountNo: '234',
        accountType: 'Savings',
        balance: '10000',
        bankName: 'Chase'
    }];

    $scope.existingEnvestAccounts = [{
        accountNo: 'xxxx1234',
        accountType: 'Checking',
        balance: '50000',
        bankName: 'Bank A',
        yield: 1.1
    }, {
        accountNo: 'xxxx2345',
        accountType: 'Savings',
        balance: '10000',
        bankName: 'Bank B',
        yield: 1.2
    }];

    $scope.envestAccounts = [{
        bankName: "Bank A",
        yield: 1.1
    }, {
        bankName: "Bank B",
        yield: 1.2
    }, {
        bankName: "Bank C",
        yield: 1.25
    }];


    $scope.getRandomSpan = function() {
        return Math.floor((Math.random() * 4) + 1);
    }

    $scope.currentYields = [0.02, 0.03, 0.04, 0.02, 0.03];
    $scope.recommendedYields = [0.9, 1.0, 1.1, 1.2, 1.25];
   

    $scope.getTransactions = function(accountId) {
        parent.location = '../transactions/transactions.html#/listTransactions?accountId=' + accountId + '&userId=' + userId;
    };


    $scope.getYield = function(principal, yield, years) {
        var num = $scope.getYieldUnformated(principal, yield, years);
        return $scope.formatNumber(num);
    };

    $scope.getYieldUnformated = function(principal, yield, years) {
        return Number(principal) * Math.pow(1 + (Number(yield) / 100), Number(years)) - Number(principal);
    };

    $scope.getIncreaseInYield = function(principal, yieldExisting, yieldProposed, years) {
        var numExsting = $scope.getYieldUnformated(principal, yieldExisting, years);
        var numProposed = $scope.getYieldUnformated(principal, yieldProposed, years);

        var increasePercent = (numProposed - numExsting) * 100 / numExsting;


        return increasePercent.toFixed(2) + ' %';
    };

    $scope.getTotalProjectedInterest = function(years) {
        var num = 0;
        if ($scope.accounts != null) {
            angular.forEach($scope.accounts, function(account) {
                num += $scope.getYieldUnformated(account.balance.available, account.yield, years);
            });            
        }
        return $scope.formatNumber(num);
    };

    $scope.getEnvestProjectedInterest = function(yield, years) {
        var num = 0;
        if ($scope.accounts != null) {
            angular.forEach($scope.accounts, function(account) {
                num += $scope.getYieldUnformated(account.balance.available, yield, years);
            });
        }
        return $scope.formatNumber(num);
    };

    $scope.getTotalAvailableFunds = function(isFormatted) {
        var num = 0;
        angular.forEach($scope.accounts, function(account) {
            num += Number(account.balance.available);
        });

        if (isFormatted)
            return $scope.formatNumber(num);
        else return num;
    };
    
    $scope.getSum = function (num1, num2) {
      if(isNaN(Number(num2)))
      return $scope.formatNumber(num1); 
        
      var num = Number(num1) + Number(num2);  
      return $scope.formatNumber(num); 
    };

    $scope.formatNumber = function(num1) {        
        return numeral(num1).format('($0,0.00)');
    };

    $scope.getAmountAvailabeForTransfer = function(isFormatted) {
        var num = 0;
        angular.forEach($scope.accounts, function(account) {
            if (!isNaN(account.transferAmount))
                num += Number(account.transferAmount);
        });

        if (isFormatted)
            return $scope.formatNumber(num);
        else return num;
    };

    $scope.getRemainingBalance = function(isFormatted) {
        var amountToTransfer = $scope.getAmountAvailabeForTransfer(false);
        var amountAvailable = $scope.getTotalAvailableFunds(false);
        var num = amountAvailable - amountToTransfer;

        if (isFormatted)
            return $scope.formatNumber(num);
        else return num;
    };

    $scope.getTotalAmountAllocated = function(isFormatted) {
        var num = 0;
        angular.forEach($scope.existingEnvestAccounts, function(account) {
            if (!isNaN(account.allocatedAmount))
                num += Number(account.allocatedAmount);
        });

        if (isFormatted)
            return $scope.formatNumber(num);

        else return num;
    };

    $scope.getRemainingAmountToAllocate = function(isFormatted) {
        var amountToTransfer = $scope.getAmountAvailabeForTransfer(false);
        var totalAllocated = $scope.getTotalAmountAllocated(false);

        var num = amountToTransfer - totalAllocated;

        if (isFormatted)
            return $scope.formatNumber(num);
        else return num;
    };


    $scope.getTransactionsSummary = function() {
        parent.location = '../transactions/transactions.html#/summary';
    };

    $scope.openRecommendations = function() {
        parent.location = '../recommendations/recommendations.html';
    };

    $scope.transferExisting = function() {
        $state.go('transferExisting');
    };
    
    $scope.linkAnotherAccount = function() {
        parent.location = '../userInfo/userInfo.html#linkNewAccount?userId=' + $scope.userId;
    };
});