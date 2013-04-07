var app_http = require('./app_http');

var html = '<script>location.replace("/' + process.env.APP_VER + '/");</script>';
var buf = new Buffer(html, 'utf8');

exports.handle = function(req, res) {
  app_http.replyNotCached(res, buf);
};

