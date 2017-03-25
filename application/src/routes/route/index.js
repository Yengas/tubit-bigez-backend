const Route = require('../../models/Route');

module.exports = (app) => {
  app.get('/routes', (req, res, next) => {
    Route.findById('58d61d6bbd503d8e60f6a142')
      .then(route => Route.findMatch(route))
      .then((result) => res.json(result))
      .catch(next);
  });
};