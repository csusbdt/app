var client = require('./model').client;

exports.isSecretGood = function(user, cb) {
  client.open(function(err, db) {
    if (err) return cb(err);
    db.collection('users').findOne(
      { _id: user.uid }, 
      { secret: 1, _id: 0 }, 
      function(err, dbUser) {
        db.close();
        if (err) return cb(err); 
        if (dbUser) {
          return cb(user.secret === dbUser.secret);
        } else {
          //console.log('WARNING: user not found');
          return cb(false);
        }
      }
    );
  });
};

/*
// Input: user.uid
// Reads: user.secret, user.expires
exports.readSecret = function(user, cb) {
  client.open(function(err, db) {
    if (err) return cb(err);
    db.collection('users').findOne(
      { _id: user.uid }, 
      { secret: 1, expires: 1, _id: 0 }, 
      function(err, dbUser) {
        db.close();
        if (err) return cb(err); 
        if (dbUser) {
          user.secret = dbUser.secret;
          user.expires = dbUser.expires;
        } else {
          console.log('WARNING: user not found');
        }
        cb();
      }
    );
  });
};
*/

// Input: user.uid, user.secret, user.expires
// Writes: user.secret, user.expires
// Note: This function creates user documents when needed.
exports.writeSecret = function(user, cb) {
  client.open(function(err, db) {
    if (err) return cb(err);
    db.collection('users').update(
      { _id: user.uid }, 
      { $set: { secret: user.secret, expires: user.expires } },
      { safe: true, upsert: true },
      function(err) {
        db.close();
        if (err) return cb(err); 
        cb();
      }
    );
  });
};

// Input: user.uid
// Reads: user.state
exports.readState = function(user, cb) {

console.log('model_user.readState: user = ' + JSON.stringify(user));

  client.open(function(err, mongoclient) {
    if (err) return cb(err);
    var db = mongoclient.db('app');
    db.collection('users').findOne(
      { _id: user.uid }, 
      { state: 1, _id: 0 }, 
      function(err, dbUser) {
        db.close();
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
  client.open(function(err, db) {
    if (err) return cb(err);
    db.collection('users').update(
      { _id: user.uid }, 
      { $set: { state: user.state } },
      { safe: true },
      function(err) {
        db.close();
        if (err) return cb(err);
        cb();
      }
    );
  });
};

