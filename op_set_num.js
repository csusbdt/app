var logger    = require('./logger');
var app_ajax  = require('./app_ajax');
var db_user   = require('./db_user');

exports.handle = function(data, res) {
  if (data.number === undefined) {
    logger.warning(__filename + ' : set_num : data.number undefined');
    return app_ajax.error(res);
  }
  var user = { id: data.uid, state: { number: data.number } };
  db_user.writeState(user, function(err) {
    if (err) {
      logger.error(__filename + ' : set_num : ' + err.message);
      return app_ajax.error(res);
    }
    return app_ajax.reply(res);
  });
};

