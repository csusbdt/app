var url       = require('url');
var logger    = require('./logger');
var app_ajax  = require('./app_ajax');
var db_user   = require('./db_user');
var fb        = require('./fb');

exports.loginReplies   = 0;
exports.getNumRequests = 0;
exports.setNumRequests = 0;
exports.unknownOps     = 0;

/*
   All incoming ajax requests are submitted by POST
   and contain data encoded in json.
*/
exports.handle = function(req, res) {
  // Extract data from json string.
  app_ajax.parse(req, function(data) {
    if (data instanceof Error) {
      logger.warning(__filename + ' : handle : ' + data.message);
      return app_ajax.error(res); 
    }
    // Check for valid Facebook access token.
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
      var pathname = url.parse(req.url).pathname;
      if (pathname === '/op/get-num') {
        ++exports.getNumRequests;
        get_num(data, res);
      } else if (pathname === '/op/set-num') {
        ++exports.setNumRequests;
        set_num(data, res);
      } else {
        ++exports.unknownOps;
      }
    });
  });
}

function get_num(data, res) {
  var user = { uid: data.uid };
  db_user.readState(user, function(err) {
    if (err) {
      logger.error(__filename + ' : get_num : ' + err.message);
      return app_ajax.error(res);
    }
    return app_ajax.reply(res, user.state);
  });
};

function set_num(data, res) {
  if (data.number === undefined) {
    logger.warning(__filename + ' : set_num : data.number undefined');
    return app_ajax.error(res);
  }
  var user = { uid: data.uid, state: { number: data.number } };
  db_user.writeState(user, function(err) {
    if (err) {
      logger.error(__filename + ' : set_num : ' + err.message);
      return app_ajax.error(res);
    }
    return app_ajax.reply(res);
  });
};

