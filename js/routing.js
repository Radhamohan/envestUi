gotoDashboard = function(userKey) {
    parent.location = "../dashboard2/dashboard.html?userKey=" + userKey;
}

gotoUserProfile = function(userKey) {
    parent.location = '../profile/profile.html?userKey=' + userKey;
}

gotoLinkBank = function(userKey) {
    parent.location = "../linkBank/bank.html?userKey=" + userKey;
}

gotoEnvestAccounts = function(userKey) {
    parent.location = '../userProduct/userProduct.html?userKey=' + userKey;    
}