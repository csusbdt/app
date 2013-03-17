var assert      = require('assert');
var Server      = require('mongodb').Server;
var MongoClient = require('mongodb').MongoClient;

//var host   = process.env.MONGO_HOST;
//var port   = parseInt(process.env.MONGO_PORT, 10);
//var mongoUri = process.env.MONGO_URI;

//exports.name = 'app';

//exports.db = db;

// Make sure we can connect to database.
// Throw any error to halt program.
exports.init = function(cb) {
  var serverOptions = {
    auto_reconnect: true, 
    poolSize: 20
  };
  var dbOptions = {
    retryMiliSeconds: 5000, 
    numberOfRetries: 4,
    w: 1
  };
  var connectOptions = {
    db: dbOptions,
    server: serverOptions
  };
//  var server = new Server(host, port, serverOptions);
//  var client = new MongoClient(server, dbOptions);
  MongoClient.connect(process.env.MONGO_URI, connectOptions, function(err, db) {
    if (err) throw err;
    assert(db !== null);
    exports.db = db;
    cb();
  }); 
};

