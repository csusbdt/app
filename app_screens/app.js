window.a = { state:{}, creds:{}, menu:{}, screens:{} };

$(function() {
 
  Screen = function(name) {
    this.name = name;
    this.$mainDiv = $('#' + name);
    this.$menuNavElement = $('#menu-' + name);
  };

  a.currentScreen = 
  a.screens.loading       = new Screen('loading');
  a.screens.title         = new Screen('title');
  a.screens.login         = new Screen('login');
  a.screens.game          = new Screen('game');
  a.screens.friends       = new Screen('friends');

  Screen.prototype.transitionTo = function(screen) {
    if (screen.onTransitionTo) screen.onTransitionTo();
    a.currentScreen.$mainDiv.fadeOut(300, function() {
      a.currentScreen.$menuNavElement.removeClass('active');
      a.currentScreen = screen;
      a.currentScreen.$mainDiv.fadeIn(300);
      a.currentScreen.$menuNavElement.addClass('active');
    });
  };
});

a.relogin = function(cb) {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      a.creds.uid = response.authResponse.userID;
      a.creds.accessToken = response.authResponse.accessToken;
      cb();
    } else if (response.status === 'not_authorized') {
      a.currentScreen.transitionTo(a.screens.login);
    } else {
      a.currentScreen.transitionTo(a.screens.login);
    }
  }, true);
};

a.login = function(cb) {
  FB.login(function(response) {
    if (response.authResponse) {
      a.creds.uid = response.authResponse.userID;
      a.creds.accessToken = response.authResponse.accessToken;
      cb();
    } else {
      a.currentScreen.transitionTo(a.screens.login);
    }
  });
};

a.init = function(fbAppId) {
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
      a.creds.uid = response.authResponse.userID;
      a.creds.accessToken = response.authResponse.accessToken;
      a.currentScreen.transitionTo(a.screens.title);
    } else {
      a.currentScreen.transitionTo(a.screens.login);
    }
  });
};

a.menu.title = function() {
  a.currentScreen.transitionTo(a.screens.title);
}

a.menu.game = function() {
  a.currentScreen.transitionTo(a.screens.game);
}

a.menu.friends = function() {
  a.currentScreen.transitionTo(a.screens.friends);
}

a.menu.about = function() {
  $("#aboutModal").modal('show');
}
 
