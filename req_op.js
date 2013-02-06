var app_ajax    = require('./app_ajax');
var model_user  = require('./model_user');
var fb          = require('./fb');

exports.get_num = function(req, res) {
  app_ajax.parse(req, function(accessToken) {
    if (accessToken instanceof Error) {
      return app_ajax.error(res, accessToken);
    } else if (creds.accessToken === undefined) {
      return app_ajax.error(res);
    } else {
      fb.getUid(creds.accessToken, function(uid) {
        if (uid instanceof Error) {
          return app_ajax.error(res);
        }
        if (uid.login !== undefined) {
          return app_ajax.login(res);
        }
        var user = { _id: uid };
        model_user.read_state(user, function(state) {
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

