var helpers = (function() {

    var _helpers = {};

    // Display an error message in an error box
    _helpers.displayError = function(id,msg) {
        $(id).text(msg);
    }

    // Hide the login/register popup
    _helpers.hidePopup = function() {
        $("#popup").css("display", "none");
        $("#cover").css("display", "none");
    }

    // Show the login/register popup
    _helpers.showPopup = function() {
        $("#popup").css("display", "block");
        $("#cover").css("display", "block");
    }
    
    Object.freeze(_helpers);
    return _helpers;
})();