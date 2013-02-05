var app_ajax    = require('./app_ajax');
var model_user  = require('./model_user');

exports.get_num = function(req, res) {
  app_ajax.parse(req, function(creds) {
    if (creds instanceof Error) {
      return app_ajax.error(res, creds);
    } else if (creds.uid === undefined) {
      return app_ajax.error(res);
    } else if (creds.accessToken === undefined) {
      return app_ajax.error(res);
    } else {
      // check accessToken HERE *****************************************
      // ASSUME CHECK FAILS
      return app_ajax.login(res);
/*
      var user = { _id: creds.uid, secret: user.secret };
      model_user.isSecretGood(user, function(result) {
        if (result instanceof Error) {
          return app_ajax.login(res);
        } else {
          model_user.read_state(user, function(state) {
            if (state instanceof Error) {
              return app_ajax.login(req, res);
            } else {
              return app_ajax.reply(res, state);
            }
          });
        }
      });
*/
    }
  });
};

