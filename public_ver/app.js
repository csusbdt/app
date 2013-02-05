a.screen = {
  fadeOutSpeed: 300,
  fadeInSpeed: 300
};

$(function() {
  var n = -1;        // -1 means it's ok to transition to another screen.
  
  // a.screen.done is called twice as follows:
  //   (1) when the old screen has faded out completely, and
  //   (2) when the javascript for the new screen has finished loading
  a.screen.done = function() {  
    if (--n === 0) {
      $('.screen').remove();
      a.screen.$nextScreen.addClass('screen');
      $('body').append(a.screen.$nextScreen);
      a.screen.$nextScreen.fadeIn(a.screen.fadeInSpeed, function() { 
        a.screen.$nextScreen = null;
        n = -1; 
      });
    }
  };
       
  a.screen.next = function(screenName) {
    if (n !== -1) return; 
    n = 2;
    a.screen.$nextScreen = $('<div></div>');
    var ref = document.getElementsByTagName('script')[0],
        js = document.createElement('script');
    js.async = true;
    js.src = screenName + '.js';
    ref.parentNode.insertBefore(js, ref);
    $('.screen').fadeOut(a.screen.fadeOutSpeed, a.screen.done);
  };
  
  a.fbLogin = function(cb) {
      FB.login(function(response) {
        if (response.authResponse) {
          a.uid = response.authResponse.userID;
          a.accessToken = response.authResponse.accessToken;
          a.screen.next('title');
          cb();
        } else {
          a.screen.next('login');
          cb(new Error('Login failed.'));
        }
      });
    };
    
  a.fbInit = function(fbAppId) {
    FB.init({
      appId      : fbAppId,
      channelUrl : '://' + window.location.host + '/channel.html',
      status     : false,  // check the login status upon init?
      cookie     : false,  // set sessions cookies?
      xfbml      : false
    });
    FB.Canvas.setAutoGrow();
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        a.uid = response.authResponse.userID;
        a.accessToken = response.authResponse.accessToken;
        a.screen.next('title');
      } else {
        a.screen.next('login');
      }
    });
  };
  
  fbAsyncInit();
});

