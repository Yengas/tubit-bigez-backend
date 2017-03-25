const log = require('../../logger');

/**
 * Registers the login related endpoints
 * @param config
 * @param app
 */
module.exports = (config, app) => {
  const { token } = config;
  const { facebook } = config.social;
  const { generate: generateToken } = require('./token')(token);

  const endpoints = {
    social: Object.assign(
      {},
      facebook.id && facebook.secret ? { facebook: require('./facebook/index')(facebook) } : {}
    )
  };

  // Register each social's login endpoints
  Object.keys(endpoints.social).forEach((name) => {
    log.info({ name }, "Registering auth endpoints for social media network.");
    // Create and respond with login url
    app.get(`/login/${name}`, (req, res) => endpoints.social[name].login(req.query).then(url => res.json({ url })));
    // Handle the callback
    app.get(`/login/${name}/callback`, (req, res) => {
      endpoints.social[name].callback(req.query)
        .then(user => {
          log.info({ user }, "Got user info.");
          return generateToken(user);
        })
        .then(token => res.json({ token }))
        .catch(err => {
          log.error({ err, name }, "An error occured while processing login callback.");
          res.status(500);
          res.json({ error: true, reason: err.message })
        });
    });
  });
};