window.a = { state:{}, creds:{}, menu:{} };

(function() {
 
  Screen = function(name) {
    this.name = name;
    this.$mainDiv = $('#' + name);
  };

  a.currentScreen = 
  a.loading       = new Screen('loading');
  a.title         = new Screen('title');
  a.login         = new Screen('login');
  a.game          = new Screen('game');

  Screen.prototype.transitionTo = function(screen) {
    if (screen.onTransitionTo) screen.onTransitionTo();
    a.currentScreen.$mainDiv.fadeOut(300, function() {
      a.currentScreen = screen;
      a.currentScreen.$mainDiv.fadeIn(300);
    });
  };

}());

a.title.initialized = false;

a.title.onTransitionTo = function() {
  if (a.title.initialized) return;
  a.title.initialized = true;
  var $img = $('#title-img'); 
  $img.attr('src', 'http://graph.facebook.com/' + a.creds.uid + '/picture?type=large');
};

a.title.playNumberGame = function() {
  a.title.transitionTo(a.game);
};

a.game.quitToTitle = function() {
  a.game.transitionTo(a.title);
};

a.game.initialized = false;

a.game.onTransitionTo = function() {
  if (a.game.initialized) return;
  a.game.initialized = true;
  if (a.state.number) {
    $('#game-num').html(a.state.number);
  } else {
    $.ajax({
      url: '/op/get-num',
      type: 'post',
      dataType: 'json',
      cache: false,
      data: JSON.stringify( { 'accessToken': a.creds.accessToken } )
    })
    .done(function(data) {
      if (data.login !== undefined) {
        a.relogin(function() { initPage(); });
      } else if (data.error !== undefined) {
        $('#game-num').html(data.error);
      } else {
        a.state = data;
        $('#game-num').html(a.state.number);
      }
    })
    .fail(function(jqxhr, textStatus, errorThrown) {
      if (errorThrown) $('#game-num').html('Error: ' + errorThrown);
      else $('#game-num').html('Error: ' + textStatus);
    });
  }
};

a.relogin = function(cb) {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      a.creds.uid = response.authResponse.userID;
      a.creds.accessToken = response.authResponse.accessToken;
      cb();
    } else if (response.status === 'not_authorized') {
      a.currentScreen.transitionTo(a.login);
    } else {
      a.currentScreen.transitionTo(a.login);
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
      a.currentScreen.transitionTo(a.login);
    }
  });
};

a.menu.title = function() {
  a.currentScreen.transitionTo(a.title);
}

a.menu.game = function() {
  a.currentScreen.transitionTo(a.game);
}

a.menu.about = function() {
  $("#aboutModal").modal('show');
}

a.game.incrementNumber = function() {
  $('#game-num').html(++a.state.number);
};

a.game.saveNumber = function() {
  $.ajax({
    url: '/op/set-num',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( { 'accessToken': a.creds.accessToken, number: a.state.number } )
  })
  .done(function(data) {
    if (data.login !== undefined) {
      a.relogin(function() { $saveBtn.click(); });
    } else if (data.error !== undefined) {
      $('#game-num').html(data.error);
    } else {
      $('#game-num').append($('<span> saved</span>'));
    }
  })
  .fail(function(jqxhr, textStatus, errorThrown) {
    if (errorThrown) $('#game-num').html('Error: ' + errorThrown);
    else $('#game-num').html('Error: ' + textStatus);
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
      a.currentScreen.transitionTo(a.title);
    } else {
      a.currentScreen.transitionTo(a.login);
    }
  });
};
  
