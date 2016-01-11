$(document).ready(function() {
  var loginPanel = $("#login-panel");
  var signupPanel = $("#signup-panel");
  var loginButton = $("#login-btn");
  var signupButton = $("#signup-btn");
  loginButton.click(function() {
    signupPanel.hide();
    loginPanel.slideDown();
  });
  signupButton.click(function() {
    loginPanel.hide();
    signupPanel.slideDown();
  });
});