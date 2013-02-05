$(function() {
  // TODO : Adding button click listener from javascript or jquery

  var $loginBtn = $('<button id="login-btn">Facebook Login</button>');  
  $loginBtn.click(function() {
    FB.login(function(response) {
      if (response.authResponse) {
        a.uid = response.authResponse.userID;
        a.accessToken = response.authResponse.accessToken;
        a.screen.next('title');
      } else {
        console.log('Login failed.');
      }
    });
  });
  a.screen.$nextScreen.append($loginBtn);
  a.screen.done();
});
