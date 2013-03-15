var app_db = require('./app_db');

var client = app_db.client;

// Input: user.uid
// Reads: user.state
exports.readState = function(user, cb) {
  client.open(function(err, client) {
    if (err) return cb(err);
    var db = client.db(app_db.name);
    db.collection('users').findOne(
      { _id: user.uid }, 
      { state: 1, _id: 0 }, 
      function(err, dbUser) {
        client.close();
        if (err) return cb(err);
        if (dbUser) {
          if (dbUser.state) {
            user.state = dbUser.state;
            return cb();
          } else {
            return cb(new Error('model_user.readState: dbUser.state is undefined'));
          }
        } else {
          // if app state missing, then use implicit app state
          user.state = { number: 0 };
          return cb();
        }
      }
    );
  });
};

// Input: user.uid, user.state
// Writes: user.state
exports.writeState = function(user, cb) {
  client.open(function(err, client) {
    if (err) return cb(err);
    var db = client.db(app_db.name);
    db.collection('users').update(
      { _id: user.uid }, 
      { $set: { state: user.state } },
      { upsert: true },
      function(err) {
        client.close();
        if (err) {
          console.log("model_user.writeState: " + err.message);
          return cb(err);
        }
        return cb();
      }
    );
  });
};

