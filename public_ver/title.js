$(function() {
  // TODO : get FB user ID to show name and picture 
  var $div = $('<div></div>');
  $div.append('<div>You are logged into Facebook</div>');
  var $btn = $('<button>Play the number game.</button>')
  $div.append($btn);
  $btn.click(function() {
    a.screen('game');
  });
  a.doneScreen($div);
});
