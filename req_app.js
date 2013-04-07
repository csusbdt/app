var url      = require('url');
var fs       = require('fs');
var zlib     = require('zlib');
var app_http = require('./app_http');

var plainHtml, gzippedHtml, etag;
var dir = 'app_screens';

exports.handle = function(req, res) {
  if (req.headers['if-none-match'] === etag) {
    return app_http.replyNotModified(res);
  }
  if (req.headers['accept-encoding'] !== undefined && 
      req.headers['accept-encoding'].indexOf('gzip') !== -1) {
    return app_http.replyCached(res, gzippedHtml, 'text/html', etag, 'gzip');
  } 
  app_http.replyCached(res, plainHtml, 'text/html', etag); 
};

exports.init = function(cb) {
  var n = 0;
  var container, about, loading, login, title, game, friends, appJs, fbJs;
  ++n; readFile('container.html', function(result) { container = result; done(); });
  ++n; readFile('about.html',     function(result) { about     = result; done(); });
  ++n; readFile('loading.html',   function(result) { loading   = result; done(); });
  ++n; readFile('login.html',     function(result) { login     = result; done(); });
  ++n; readFile('title.html',     function(result) { title     = result; done(); });
  ++n; readFile('game.html',      function(result) { game      = result; done(); });
  ++n; readFile('friends.html',   function(result) { friends   = result; done(); });
  ++n; readFile('app.js',         function(result) { appJs     = result; done(); });
  ++n; readFile('fb.js',          function(result) { fbJs      = result; done(); });
  function done() { 
    if (--n !== 0) return;
    fbJs = fbJs.replace(/FB_APP_ID/g, process.env.FB_APP_ID);
    container = container.replace(/SCREENS/, about + loading + login + title + game + friends);
    container = container.replace(/APP_JS/,  appJs); 
    container = container.replace(/FB_JS/,   fbJs);
    container = container.replace(/APP_VER/g,  process.env.APP_VER); 
    plainHtml = new Buffer(container, 'utf8');
    etag = app_http.etag(plainHtml);
    zlib.gzip(plainHtml, function(err, result) {
      if (err) throw err;
      gzippedHtml = result;
      cb();
    });
  }
}

function readFile(fileName, cb) {
  fs.readFile(dir + '/' + fileName, 'utf8', function(err, data) {
    if (err) throw err;
    cb(data);
  });
}

