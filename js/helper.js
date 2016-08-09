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
    expiryTime.setTime(expiryTime.getTime() + 20 * 1000);    
    storage.put(key, value, {'expires': expiryTime, 'path': '/'});
};

getCookie = function(storage, key) {
    return storage.get(key);
};

intializeHeaderController = function(app) {
    app.controller('headerController', function($rootScope, $scope, $http) {

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
        
        $scope.deleteAccountClick = function() {
            alert('Delete Account Feature is not Live Yet');  
        };

        $scope.logoutClick = function() {
            $scope.loginClick();
        };
    });
}

isRoot = function() {
    return location.pathname == '/';
}