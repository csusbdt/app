var url        = require('url');
var logger     = require('./logger');
var app_ajax   = require('./app_ajax');
var db_user    = require('./db_user');
var fb         = require('./fb');
var op_get_num = require('./op_get_num');
var op_set_num = require('./op_set_num');

exports.loginReplies   = 0;
exports.getNumRequests = 0;
exports.setNumRequests = 0;
exports.unknownOps     = 0;

function checkVersion(data, res, cb) {
  if (data.appVer === undefined) {
    logger.warning('appVer missing from ajax request', __filename);
    return app_ajax.error(res);
  }
  if (data.appVer != process.env.APP_VER) {
    return app_ajax.badVersion(res);
  }
  return cb();
}

// If facebook access token is bad, then tell client to login.
function checkLogin(data, res, cb) {
  if (data.accessToken === undefined) {
    logger.warning('facebook access token missing from ajax request', __filename);
    return app_ajax.error(res);
  }
  fb.getUid(data.accessToken, function(uid) {
    if (uid === undefined) { // user needs to login
      ++exports.loginReplies;
      return app_ajax.login(res);
    }
    if (uid instanceof Error) {
      logger.error(__filename + ' : handle : ' + uid.message);
      return app_ajax.error(res);
    }
    data.uid = uid;
    return cb();
  });
}

/*
   All incoming ajax requests are submitted by POST
   and contain data encoded in json.
*/
exports.handle = function(req, res) {
  app_ajax.parse(req, function(data) {
    if (data instanceof Error) {
      logger.warning(__filename + ' : handle : ' + data.message);
      return app_ajax.error(res); 
    }
    checkVersion(data, res, function() {
      checkLogin(data, res, function() {
        var pathname = url.parse(req.url).pathname;
        if (pathname === '/op/get-num') {
          ++exports.getNumRequests;
          op_get_num.handle(data, res);
        } else if (pathname === '/op/set-num') {
          ++exports.setNumRequests;
          op_set_num.handle(data, res);
        } else {
          ++exports.unknownOps;
        }
      });
    });
  });
}

