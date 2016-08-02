getQueryStringKeyValue = function(href, key) {
    var url = decodeURIComponent(href);    
    url = url.substring(1);    
    
    var queryArray = url.split("?")[1].split("&");
    var search = key + "=";
    
    for (i = 0; i < queryArray.length; i++) {
        if (queryArray[i].indexOf(search) >= 0) {
            return queryArray[i].replace(search, "").split("#")[0];
        }
        else{
            alert("Key not found!");
        }
    }
}