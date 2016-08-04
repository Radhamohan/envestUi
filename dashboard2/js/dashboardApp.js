var dashboardApp = angular.module('dashboardApp', ['ngAnimate', 'ui.router']);
var regionUrl;
var bankData;
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

dashboardApp.controller('dashboardController', function($rootScope, $scope, $http, $state) {
    $scope.user = {};        
    $scope.user.userKey = getUserKeyOrRedirect(window.location.href, "userKey");

    $state.go("load");
    
    $http.get("https://envestment.herokuapp.com/eNvest/ProductService/getRecommendedProducts?" +
            "userKey=" + $scope.user.userKey)
        .success(function(data, status) {
            for (i = 0; i < data.length; i++) {
                if (data[i].productType == "CertificateOfDeposit") {
                    regionUrl = './partial/cd.html';
                    $scope.cd = data[i];
                    $scope.cd.interestRate = 1.7;
                    $scope.cd.maturityYears = 3;
                }
                if (data[i].productType == "HighYieldAccount") {
                    regionUrl = './partial/hya.html';
                    $scope.hya = data[i];
                    $scope.hya.interestRate = 1.1;
                }
                if (data[i].productType == "MonthlyInvestmentPlan") {
                    regionUrl = './partial/mip.html';
                    $scope.mip = data[i];
                    $scope.mip.interestRate = 1.2;
                    $scope.mip.noOfYears = 3;
                }
            }
            $state.go("accounts");
        });

    $http.get("https://envestment.herokuapp.com/eNvest/ProductService/getRecommendedProducts?" +
            "userKey=" + $scope.user.userKey)
        .success(function(data, status) {
            for (i = 0; i < data.length; i++) {
                if (data[i].productType == "CertificateOfDeposit") {
                    regionUrl = './partial/cd.html';
                    $scope.cd = data[i];
                }
                if (data[i].productType == "HighYieldAccount") {
                    regionUrl = './partial/hya.html';
                }
                if (data[i].productType == "MonthlyInvestmentPlan") {
                    regionUrl = './partial/mip.html';
                    $scope.mip = data[i];
                }
            }
            $state.go("accounts");
        });

    $http.get("https://envestment.herokuapp.com/eNvest/UserAccountService/users/getDashBoard?" +
            "userKey=" + $scope.user.userKey)
        .success(function(data, status) {
            $scope.accounts = data.accounts;
            bankData = {};
            bankData['summary'] = {};

            var arr = [];
            var bankBalances = data.dashBoardSummary.bankBalances;

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
        });


    $scope.getMipMaturity = function() {
        var effectiveRate = $scope.mip.interestRate / 100 / 12;
        var num = $scope.mip.monthlyCashFlow * ((Math.pow(1 + effectiveRate, $scope.mip.noOfYears * 12) - 1) / effectiveRate);
        return $scope.formatNumber(num)
    };

    $scope.getCDMaturity = function() {
        var effectiveRate = $scope.cd.interestRate / 100;
        var num = $scope.cd.principle * (Math.pow(1 + effectiveRate, $scope.cd.maturityYears));
        return $scope.formatNumber(num)
    };

    $scope.getValueAfterPeriod = function(year) {
        var effectiveRate = $scope.hya.interestRate / 100;
        var num = $scope.hya.principle * (Math.pow(1 + effectiveRate, year));
        return $scope.formatNumber(num)
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
        parent.location = '../linkBank/bank.html?userKey=' + $scope.user.userKey;
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
        parent.location = '../profile/profile.html?userKey=' + $scope.user.userKey;
    };
});