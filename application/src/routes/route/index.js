const Route = require('../../models/Route');

module.exports = (app) => {
  app.get('/routes/:id', (req, res, next) => {
    const { id } = req.params;
    return Route.findById(id)
      .then((result) => {
      res.json(result)
    })
      .catch(next);
  });

  app.get('/routes/:id/match', (req, res, next) => {
    const { id } = req.params;
    Route.findById(id)
      .then(route => Route.findMatch(route))
      .then((result) => res.json(result))
      .catch(next);
  });
};