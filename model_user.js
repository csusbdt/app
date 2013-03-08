var client = require('./model').client;

// Input: user.uid
// Reads: user.state
exports.readState = function(user, cb) {
  client.open(function(err, mongoclient) {
    if (err) return cb(err);
    var db = mongoclient.db('app');
    db.collection('users').findOne(
      { _id: user.uid }, 
      { state: 1, _id: 0 }, 
      function(err, dbUser) {
        mongoclient.close();
        if (err) return cb(err);
        if (dbUser) {
          if (dbUser.state) {
            return cb(dbUser.state);
          } else {
            return cb(new Error('model_user.readState: dbUser.state is undefined'));
          }
        } else {
          // if app state missing, then use implicit app state
          return cb({ number: 0 });
        }
      }
    );
  });
};

// Input: user.uid, user.state
// Writes: user.state
exports.writeState = function(user, cb) {
  client.open(function(err, mongoclient) {
    if (err) return cb(err);
    var db = mongoclient.db('app');
    db.collection('users').update(
      { _id: user.uid }, 
      { $set: { state: user.state } },
      { upsert: true },
      function(err) {
        mongoclient.close();
        if (err) {
          console.log("model_user.writeState: " + err.message);
          return cb(err);
        }
        return cb();
      }
    );
  });
};

