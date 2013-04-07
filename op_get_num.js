//var logger    = require('./logger');
var app_ajax  = require('./app_ajax');
var db_user   = require('./db_user');

exports.handle = function(data, res) {
  var user = { id: data.uid };
  db_user.readState(user, function(err) {
    if (err) {
      logger.error(__filename + ' : get_num : ' + err.message);
      return app_ajax.error(res);
    }
    return app_ajax.reply(res, user.state);
  });
};

