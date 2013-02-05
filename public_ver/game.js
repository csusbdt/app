$(function() {
  var $btn = $('<button>Quit to title</button>')
  $btn.click(function() {
    a.screen.next('title');
  });
  a.screen.$nextScreen.append('<div>You are playing the number game.</div>');
  a.screen.$nextScreen.append($btn);
  a.screen.done();
});

