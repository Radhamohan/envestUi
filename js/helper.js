getQueryStringKeyValue = function(href, key) {
    var url = decodeURIComponent(href);
    url = url.substring(1);

    var temp = url.split("?")
    if (temp.length < 2)
        return false;
    var queryArray = temp[1].split("&");
    var search = key + "=";

    for (i = 0; i < queryArray.length; i++) {
        if (queryArray[i].indexOf(search) >= 0) {
            return queryArray[i].replace(search, "").split("#")[0];
        } else {
            return false;
        }
    }
};

getUserKeyOrRedirect = function(href, key) {
    userKey = getQueryStringKeyValue(href, key);
    if (!userKey) {
        parent.location = "../";
        return false;
    } else
        return userKey;
}


intializeHeaderController = function(app) {
    app.controller('headerController', function($rootScope, $scope, $http) {

        $scope.user = {};

        $scope.user.loggedIn = true;
        $scope.user.loggedOut = true;

        userKey = getQueryStringKeyValue(window.location.href, "userKey");

        if (!userKey) {
            $scope.user.loggedIn = false;
            $scope.user.loggedOut = true;
        }
        if (userKey) {
            $scope.user.loggedIn = true;
            $scope.user.loggedOut = false;
        }

        $scope.loginClick = function() {
            if (isRoot())
                parent.location = './#existingUser';
            else
                parent.location = '../#existingUser';
        };

        $scope.signUpClick = function() {
            if (isRoot())
                parent.location = './#newUser';
            else
                parent.location = '../#newUser';
        };

        $scope.logoutClick = function() {
            $scope.loginClick();
        };
    });
}

isRoot = function() {
    return location.pathname == '/';
}