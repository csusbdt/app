$(function() {
  // TODO : Adding button click listener from javascript or jquery

  var $loginBtn = $('<button id="login-btn">Facebook Login</button>');  
  $loginBtn.click(function() {
    a.fbLogin(function() {
      console.log('just logged in.');
    });
  });
  a.screen.$nextScreen.append($loginBtn);
  a.screen.done();
});
