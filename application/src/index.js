const config = require('./config'),
      express = require('express'),
      bodyParser = require('body-parser'),
      databaseConnection = require('./database')(config.mongo),
      cache = require('./cache/index')(config.redis),
      log = require('./logger'),
      app = express();

// Allow cors for remote access.
app.use(require('./middlewares/cors')(Object.assign({}, config.cors, { headers: [ config.headers.token] })));
// Use middleware to check for user auth through defined header.
app.use(require('./middlewares/auth')(config.headers.token, cache.auth));
// App use body parser.
app.use(bodyParser.json({ extended: true }));

// Insert login related endpoints.
require('./routes/login/index')({ token: config.token, social: config.social }, app, cache.auth);
// Insert marker related endpoints
require('./routes/marker/index')(app);
// Inser route related endpoints
require('./routes/route/index')(app);

databaseConnection
  .then(() => {
    log.info("Database connection initiated.");
    return cache.client.pingAsync();
  }).then(() => {
    log.info("Cache connection initiated.");
    app.listen(config.port, () => {
      log.info({ port: config.port }, "Started listening for requests.");
    });
  })
  .catch((err) => {
    log.error({ reason: err.message }, "An error occured while connecting to the database.");
    process.exit(-1);
  });
