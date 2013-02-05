$(function() {
  var $quitBtn = $('<button>Quit to title</button>')
  $quitBtn.click(function() { a.screen.next('title'); });

  var $numDiv = $('<div id="num"></div>');
  if (a.state) {
    $numDiv.html(a.state.number);
  } else {
    $.ajax({
      url: '/op/get-num',
      type: 'post',
      dataType: 'json',
      cache: false,
      data: JSON.stringify(a.creds)
    })
    .done(function(state) {
      if (state.login !== undefined) {
        $numDiv.html('Need to login.');
      } else if (state.error !== undefined) {
        $numDiv.html(state.error);
      } else {
        a.state = state;
        $numDiv.html(state.number);
      }
    })
    .fail(function(jqxhr, textStatus, errorThrown) {
      if (errorThrown) $numDiv.html('Error: ' + errorThrown);
      else $numDiv.html('Error: ' + textStatus);
    });
  }
  a.screen.append('<div>You are playing the number game.</div>');
  a.screen.append($numDiv);
  a.screen.append($quitBtn);
  a.screen.done();
});

