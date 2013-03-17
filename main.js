var app_db  = require('./app_db');
var router  = require('./router');
var fb      = require('./fb');
var logger  = require('./logger');

// TODO: minify js and css as part of deployment process.
// IDEA: minify at startup rather than as a build step.

// Look into closure.

// Check for required environmental variables.
if (process.env.PORT       === undefined) throw new Error('PORT not defined');
if (process.env.MONGO_URI  === undefined) throw new Error('MONGO_URI not defined');
if (process.env.FB_APP_ID  === undefined) throw new Error('FB_APP_ID not defined');
if (process.env.APP_VER    === undefined) throw new Error('APP_VER not defined');

if (process.env.LOGGER_MAX_WARNINGS === undefined) {
  process.env.LOGGER_MAX_WARNINGS = 16;
  logger.warning('LOGGER_MAX_WARNINGS not defined; defaulting to 16.');
}

if (process.env.LOGGER_MAX_ERRORS === undefined) {
  process.env.LOGGER_MAX_ERRORS = 16;
  logger.warning('LOGGER_MAX_ERRORS not defined; defaulting to 16.');
}

if (process.env.LOGGER_MAX_INFO === undefined) {
  process.env.LOGGER_MAX_INFO = 16;
  logger.warning('LOGGER_MAX_INFO not defined; defaulting to 16.');
}

// Trim for foreman.
process.env.PORT       = process.env.PORT       .replace(' ', '');
process.env.MONGO_URI  = process.env.MONGO_URI  .replace(' ', '');
process.env.FB_APP_ID  = process.env.FB_APP_ID  .replace(' ', '');
process.env.APP_VER    = process.env.APP_VER    .replace(' ', '');

// Run intializations before starting router.
var n = 3;
function done() {
  if (--n === 0) router.start();
}
app_db .init(done);
router .init(done);
fb     .init(done);

