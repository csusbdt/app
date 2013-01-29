var http        = require('http');
var url         = require('url');
var app_http    = require('./app_http');
var req_root    = require('./req_root');
var req_app     = require('./req_app');
var req_mem     = require('./req_mem');
var req_file    = require('./req_file');

var version;

function route(req, res) {
  var pathname = url.parse(req.url).pathname;
  if      (pathname === '/')            app_http  .redirect(res, '/' + version)
  else if (pathname === '/' + version)  req_root  .handle(req, res);
  else if (pathname === '/mem')         req_mem   .handle(req, res);
  else                                  req_file  .handle(req, res);
}

function requestHandler(req, res) {
  // Make sure messages are sent over https when deployed through Heroku.
  // See https://devcenter.heroku.com/articles/http-routing
  if (req.headers['x-forwarded-proto'] === 'https' ||    // common case
      req.headers['x-forwarded-proto'] === undefined) {  // local deployment
    route(req, res);
  } else {
    res.writeHead(302, { 'Location': "https://" + req.headers.host + req.url });
    res.end();
  }
}

exports.start = function(_version) {
  version = _version;
  http.createServer(requestHandler).listen(process.env.PORT, function(err) {
    if (err) console.log(err);
    else console.log("listening on " + process.env.PORT);
  });
};
