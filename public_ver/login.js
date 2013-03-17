$(function() {
  // TODO : Adding button click listener from javascript or jquery

  var $loginBtn = $('<button id="login-btn">Facebook Login</button>');  
  $loginBtn.click(function() {
    FB.login(function(response) {
      if (response.authResponse) {
        a.creds.uid = response.authResponse.userID;
        a.creds.accessToken = response.authResponse.accessToken;
        a.screen.next('title');
      } else {
        console.log('Login failed.');
      }
    });
  });
  a.screen.append($loginBtn);
  a.screen.done();
});
