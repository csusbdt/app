var app_db = require('./app_db');

// Input: user.uid
// Reads: user.state
exports.readState = function(user, cb) {
  app_db.db.collection('users').findOne(
    { _id: user.id }, 
    { state: 1, _id: 0 }, 
    function(err, dbUser) {
      app_db.db.close();
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
};

// Input: user.id, user.state
// Writes: user.state
exports.writeState = function(user, cb) {
  app_db.db.collection('users').update(
    { _id: user.id }, 
    { $set: { state: user.state } },
    { upsert: true },
    function(err) {
      app_db.db.close();
      if (err) {
        console.log("model_user.writeState: " + err.message);
        return cb(err);
      }
      return cb();
    }
  );
};

