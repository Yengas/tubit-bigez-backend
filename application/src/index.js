const config = require('./config'),
      express = require('express'),
      bodyParser = require('body-parser'),
      databaseConnection = require('./database')(config.mongo),
      log = require('./logger'),
      app = express();

// App use required middlewares.
app.use(bodyParser.json({ extended: true }));

// Allow cors for remote access.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", config.frontend.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

// Insert login related endpoints.
require('./controllers/login/index')({ token: config.token, social: config.social }, app);

databaseConnection
  .then(() => {
    log.info("Database connection initiated.");

    app.listen(config.port, () => {
      log.info({ port: config.port }, "Started listening for requests.");
    });
  })
  .catch(() => {
    log.error({ err }, "An error occured while connecting to the database.");
    process.exit(-1);
  });
