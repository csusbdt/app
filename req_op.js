var app_ajax  = require('./app_ajax');
var db_user   = require('./db_user');
var fb        = require('./fb');

exports.get_num = function(req, res) {
  app_ajax.parse(req, function(data) {
    if (data instanceof Error) {
      return app_ajax.error(res, data);
    } else if (data.accessToken === undefined) {
      return app_ajax.error(res);
    } else {
      fb.getUid(data.accessToken, function(uid) {
        if (uid === undefined) { // user needs to login
          return app_ajax.login(res);
        }
        if (uid instanceof Error) {
          return app_ajax.error(res);
        }
        var user = { uid: uid };
        db_user.readState(user, function(state) {
          if (state instanceof Error) {
            return app_ajax.error(res);
          } else {
            return app_ajax.reply(res, state);
          }
        });
      });
    }
  });
};

exports.set_num = function(req, res) {
  app_ajax.parse(req, function(data) {
    if (data instanceof Error) {
      return app_ajax.error(res, data);
    } else if (data.accessToken === undefined) {
      return app_ajax.error(res);
    } else {
      if (data.number === undefined) {
        console.log('warning: req_op.set_num: data.number undefined');
        return app_ajax.error(res);
      }
      fb.getUid(data.accessToken, function(uid) {
        if (uid === undefined) { // user needs to login
          return app_ajax.login(res);
        }
        if (uid instanceof Error) {
          return app_ajax.error(res);
        }
        var user = { uid: uid, state: { number: data.number } };
        db_user.writeState(user, function(err) {
          if (err instanceof Error) {
            return app_ajax.error(res);
          } else {
            return app_ajax.reply(res, user.state);
          }
        });
      });
    }
  });
};

