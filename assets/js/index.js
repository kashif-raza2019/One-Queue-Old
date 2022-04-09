// Select Change Function 
function selectChangeFunc() {
    var category = document.getElementById("category").value;
    var string = location.href;
    var string1 = "";
    var string2 = "";
    if(string.indexOf("?") > -1) {
        string1 = string.substring(0, string.indexOf("?"));
        string2 = string.substring(string.indexOf("?") + 1, string.length);
    }
    if(category != "") {
        string1 += "?category=" + category;
        string1 += "&" + string2;
        string = string1;
    }
    window.location.href = string;
}