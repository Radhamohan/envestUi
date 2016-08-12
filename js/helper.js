getQueryStringKeyValue = function(href, key) {
    var url = decodeURIComponent(href).toLowerCase();
    url = url.substring(1);

    var temp = url.split("?")
    if (temp.length < 2)
        return false;
    var queryArray = temp[1].split("&");
    var search = (key + "=").toLowerCase();

    for (i = 0; i < queryArray.length; i++) {
        if (queryArray[i].indexOf(search) >= 0) {
            return queryArray[i].replace(search, "").split("#")[0];
        } else {
            return false;
        }
    }
};
var isSessionExpired = false;
getUserKeyOrRedirect = function(href, key) {
    userKey = getQueryStringKeyValue(href, key);
    if (!userKey) {
        parent.location = "../";
        return false;
    } else
        return userKey;
};


setCookie = function(storage, key, value) {
    var expiryTime = new Date();
    expiryTime.setTime(expiryTime.getTime() + 5 * 60 * 1000);
    storage.put(key, value, {
        'expires': expiryTime,
        'path': '/'
    });
};

getCookie = function(storage, key) {
    return storage.get(key);
};

removeCookie = function(storage, key) {
    var expiryTime = new Date();
    expiryTime.setTime(expiryTime.getTime() - 5 * 60 * 1000);
    storage.put(key, getCookie(storage, 'token'), {
        'expires': expiryTime,
        'path': '/'
    });
};

getHeader = function(storage) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': getCookie(storage, 'token')
        }
    };
};

handleError = function() {
    if (!isSessionExpired) {
        isSessionExpired = true;
        alert('User session expired!');
        goToStartPage(true);
    }
};

goToStartPage = function(login) {
    var prefix = '.';
    var state = login ? '#existingUser' : '#newUser';

    if (isRoot())
        parent.location = './' + state;
    else
        parent.location = prefix + './' + state;
};

getBaseWebserviceUrl = function() {
    return "https://envestment.herokuapp.com/eNvest";
}

intializeHeaderController = function(app) {
    app.controller('headerController', function($rootScope, $scope, $http, $cookies) {

        $scope.user = {};

        $scope.user.hideLoggedInLink = true;
        $scope.user.hideLoggedOutLink = true;

        userKey = getQueryStringKeyValue(window.location.href, "userKey");

        if (!userKey) {
            $scope.user.hideLoggedInLink = false;
            $scope.user.hideLoggedOutLink = true;
        }
        if (userKey) {
            $scope.user.hideLoggedInLink = true;
            $scope.user.hideLoggedOutLink = false;
        }

        $scope.loginClick = function() {
            goToStartPage(true);
        };

        $scope.signUpClick = function() {
            goToStartPage(false);
        };

        $scope.deleteAccountClick = function() {
            alert('Delete Account Feature is not Live Yet');
        };

        $scope.logoutClick = function() {
            $cookies.remove('token');
            removeCookie($cookies, 'token');
            goToStartPage(true);
        };
    });
}

isRoot = function() {
    return location.pathname == '/';
}