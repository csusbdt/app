$(function() {
  // TODO : get FB user ID to show name and picture 
  var $btn = $('<button>Play the number game.</button>')
  $btn.click(function() {
    a.screen.next('game');
  });
  a.screen.$nextScreen.append('<div>You are logged into Facebook</div>');
  a.screen.$nextScreen.append($btn);
  a.screen.done();
});
