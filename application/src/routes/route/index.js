const Route = require('../../models/Route');

module.exports = (app) => {
  app.get('/routes', (req, res, next) => {
    Route.findById('58d65630a2d1a578dcbc908a')
      .then(route => Route.findMatch(route))
      .then((result) => res.json(result))
      .catch(next);
  });
};