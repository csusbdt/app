(function() {
  a.load = function(file) {
    $.ajax({
      url: file
    })
    .done(function(data) {
      alert(data);
    })
    .fail(function(jqXHR, textStatus) {
      alert(textStatus);
    });
  };
  var html = localStorage.getItem('title.html');
  if (html === null) {
    a.load('title.html');
  }
}());

