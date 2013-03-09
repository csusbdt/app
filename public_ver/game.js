$(function() {
  var $quitBtn = $('<button>Quit to title</button>')
  var $numDiv = $('<div id="num"></div>');
  var $incBtn = $('<button>Increment number</button>')
  var $saveBtn = $('<button>Save number</button>')

  a.screen.append('<div>You are playing the number game.</div>');
  a.screen.append($numDiv);
  a.screen.append($incBtn);
  a.screen.append($saveBtn);
  a.screen.append($quitBtn);

  $quitBtn.click(function() { a.screen.next('title'); });

  function initPage() {
    if (a.state) {
      $numDiv.html(a.state.number);
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
          $numDiv.html(data.error);
        } else {
          a.state = data;
          $numDiv.html(a.state.number);
        }
      })
      .fail(function(jqxhr, textStatus, errorThrown) {
        if (errorThrown) $numDiv.html('Error: ' + errorThrown);
        else $numDiv.html('Error: ' + textStatus);
      });
    }
  }

  $incBtn.click(function() { 
    $numDiv.html(++a.state.number); 
  });

  $saveBtn.click(function() { 
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
        $numDiv.html(data.error);
      } else {
        $numDiv.append($('<span> saved</span>'));
      }
    })
    .fail(function(jqxhr, textStatus, errorThrown) {
      if (errorThrown) $numDiv.html('Error: ' + errorThrown);
      else $numDiv.html('Error: ' + textStatus);
    });
  });

  initPage();
  a.screen.done();
});

