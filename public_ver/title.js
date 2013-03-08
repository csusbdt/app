$(function() {
  // TODO : get FB user ID to show name and picture 
  var $photo = $('<div><img src="http://graph.facebook.com/' + a.creds.uid + '/picture?type=large"/></div>');

  var $playBtn = $('<button>Play the number game.</button>');
  $playBtn.click(function() { a.screen.next('game'); });

  a.screen.append('<div>You are logged into Facebook</div>');
  a.screen.append($photo);
  a.screen.append($playBtn);
  a.screen.done();
});
