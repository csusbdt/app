$(function() {
  var $div = $('<div></div>');
  $div.append('<div>You are playing the number game.</div>');
  var $btn = $('<button>Quit to title</button>')
  $div.append($btn);
  $btn.click(function() {
    a.screen('title');
  });
  a.doneScreen($div);
});

