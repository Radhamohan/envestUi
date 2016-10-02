var dashboardApp = angular.module('dashboardApp', ['ngAnimate', 'ui.router', 'ngCookies']);

var regionUrl;
var bankData;
var userKey = 0;
var i = 0;

dashboardApp.factory('mytime', function($timeout, $http, $cookies) {
    var time = {};

    (function tick() {
        $http.get(getBaseWebserviceUrl() + "/UserAccountService/users/getDashBoard?" +
            "userKey=" + userKey, getHeader($cookies))
        .then(function(response, status) {
           time.now = i++;
        }, function(response) {
            handleError();
        });      
        
        
        $timeout(tick, 1000);
    })();
    return time;
});

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
                templateUrl: '../footer2.html'
            },
            'middle@accounts': {
                templateUrl: './partial/recommendations.html'
            },
            'main@accounts': {
                templateUrl: './partial/main.html'
            },
            'bankData@accounts': {
                templateUrl: './partial/bankData.html'
            },
            'region1@accounts': {
                templateUrl: './partial/hya.html'
            },
            'region2@accounts': {
                templateUrl: './partial/mip.html'
            },

            'region3@accounts': {
                templateUrl: './partial/cd.html'
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
                templateUrl: './partial/transferExisting.html'
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

intializeHeaderController(dashboardApp);


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

dashboardApp.controller('dashboardController', function($rootScope, $scope, $http, $state, $cookies, mytime) {

    $scope.user = {};
    $scope.user.userKey = getUserKeyOrRedirect(window.location.href, "userKey");
    userKey = $scope.user.userKey;

    $state.go("load");
    
    $scope.mytime = mytime;


    $http.get(getBaseWebserviceUrl() + "/ProductService/getRecommendedProducts?" +
            "userKey=" + $scope.user.userKey, getHeader($cookies))
        .then(function(response, status) {
            var data = response.data;
            for (i = 0; i < data.length; i++) {
                if (data[i].productType == "CertificateOfDeposit") {
                    regionUrl = './partial/cd.html';
                    $scope.cd = data[i];
                }
                if (data[i].productType == "HighYieldAccount") {
                    regionUrl = './partial/hya.html';
                    $scope.hya = data[i];
                }
                if (data[i].productType == "MonthlyInvestmentPlan") {
                    regionUrl = './partial/mip.html';
                    $scope.mip = data[i];
                }
            }
            $state.go("accounts");
        }, function(response) {
            handleError();
        });


    $http.get(getBaseWebserviceUrl() + "/UserAccountService/users/getDashBoard?" +
            "userKey=" + $scope.user.userKey, getHeader($cookies))
        .then(function(response, status) {
            $scope.accounts = response.data.accounts;
            bankData = {};
            bankData['summary'] = {};

            var arr = [];
            var bankBalances = response.data.dashBoardSummary.bankBalances;

            for (i = 0; i < bankBalances.length; i++) {
                arr.push({
                    "label": bankBalances[i].bankName,
                    "value": Math.round(bankBalances[i].availableBalance * 100) / 100
                })
            }

            bankData['summary'].content = arr;

            bankData['Chase'] = {
                "content": [{
                    "label": "Checking",
                    "value": 5000,
                }, {
                    "label": "Summary",
                    "value": 15000,
                }]
            };

            bankData['Wells Fargo'] = {
                "content": [{
                    "label": "Checking",
                    "value": 5000,
                }, {
                    "label": "Summary",
                    "value": 5000,
                }]
            };

            drawPieChart(bankData['summary'], 'bankSummary');
        }, function(response) {
            handleError();
        });


    $scope.getMipMaturity = function(format) {
        if ($scope.mip == null) return;

        var effectiveRate = $scope.mip.interestRate / 100 / 12;
        var num = $scope.mip.monthlyCashFlow * ((Math.pow(1 + effectiveRate, $scope.mip.maturityYears * 12) - 1) / effectiveRate);
        if (format)
            return $scope.formatNumber(num);
        else return num;
    };

    $scope.getCDMaturity = function(format) {
        if ($scope.cd == null) return;
        var effectiveRate = $scope.cd.interestRate / 100;
        var num = $scope.cd.principle * (Math.pow(1 + effectiveRate, $scope.cd.maturityYears));
        if (format)
            return $scope.formatNumber(num);
        else return num;
    };

    $scope.getValueAfterPeriod = function(year, format) {
        if ($scope.hya == null) return;
        var effectiveRate = $scope.hya.interestRate / 100;
        var num = $scope.hya.principle * (Math.pow(1 + effectiveRate, year));
        if (format)
            return $scope.formatNumber(num);
        else return num;
    };


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

    $scope.linkAnotherAccount = function() {
        gotoLinkBank($scope.user.userKey);
        //parent.location = '../linkBank/bank.html?userKey=' + $scope.user.userKey;
    }


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

    $scope.getAverageYield = function() {
        var num = 0;
        var index = 0;
        angular.forEach($scope.accounts, function(account) {
            index++;
            num += Number(account.yield);
        });

        return num / index;
    };

    $scope.getSum = function(num1, num2) {
        if (isNaN(Number(num2)))
            return $scope.formatNumber(num1);

        var num = Number(num1) + Number(num2);
        return $scope.formatNumber(num);
    };

    $scope.formatNumber = function(num1) {
        return numeral(num1).format('($0,0.00)');
    };

    $scope.formatNonCurrencyNumber = function(num1) {
        return numeral(num1).format('(0,0.00)');
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

    $scope.showUserProfile = function() {
        gotoUserProfile($scope.user.userKey);
    };


    $scope.opnCDAccount = function() {
        $http.get(getBaseWebserviceUrl() + "/ProductService/saveUserProduct?" +
                "userKey=" + $scope.user.userKey +
                "&productId=" + $scope.cd.productId +
                "&interestRate=" + $scope.cd.interestRate +
                "&principle=" + $scope.cd.principle +
                "&valueAtMaturity=" + $scope.getCDMaturity(false), getHeader($cookies))
            .then(function(data, status) {
                alert('Certificate Of Deposit Account Opened');
            }, function(response) {
                handleError();
            });
    }

    $scope.openMonthlyInvestmentPlan = function() {
        $http.get(getBaseWebserviceUrl() + "/ProductService/saveUserProduct?" +
                "userKey=" + $scope.user.userKey +
                "&productId=" + $scope.mip.productId +
                "&interestRate=" + $scope.mip.interestRate +
                "&principle=" + $scope.mip.monthlyCashFlow +
                "&valueAtMaturity=" + $scope.getMipMaturity(), getHeader($cookies))
            .then(function(data, status) {
                alert('Monthly Investment Plan Account Opened');
            }, function(response) {
                handleError();
            });
    }

    $scope.openSavingsAccount = function() {
        $http.get(getBaseWebserviceUrl() + "/ProductService/saveUserProduct?" +
                "userKey=" + $scope.user.userKey +
                "&productId=2002" +
                "&interestRate=1.1" +
                "&principle=10000" +
                "&valueAtMaturity=20000", getHeader($cookies))
            .then(function(data, status) {
                alert('Savings Account Opened');
            }, function(response) {
                handleError();
            });
    }

    $scope.showEnvestAccounts = function() {
        gotoEnvestAccounts($scope.user.userKey);
        //parent.location = '../userProduct/userProduct.html?userKey=' + $scope.user.userKey;
    };

    $scope.showTransactions = function() {
        parent.location = '../transactions/transactions.html?userkey=' + $scope.user.userKey;
    };
});