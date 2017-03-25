const Route = require('../../models/Route');

module.exports = (app) => {
  app.get('/routes/:id', (req, res, next) => {
    const { id } = req.params;
    return Route.findById(id)
      .then((result) => res.json(result))
      .catch(next);
  });

  app.get('/routes/:id/match', (req, res, next) => {
    const { id } = req.params;
    Route.findById(id)
      .then(route => route ? Route.findMatch(route) : Promise.reject(route))
      .then((result) => res.json(result))
      .catch(next);
  });

  app.post('/routes', (req, res, next) => {
    if(!req.user) next(new Error("This requires an authenticated user!"));
    const { start, end, routeBody } = req.body;
    const route = new Route();
    route.period.start = start;
    route.period.end = end;
    route.period.route = routeBody;
    route.person = req.user._id;

    return route.save()
      .then((result) => res.json(result))
      .catch(next);
  });
};