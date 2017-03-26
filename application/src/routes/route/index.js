const Route = require('../../models/Route');
const validation = require('./validation');
const Joi = require('joi');

module.exports = (app, options = {}) => {
  const { mail } = options;

  // Set the notification to either mailing or noop by checking the options.
  const notification = mail ? mail.single : () => {};

  app.get('/routes/:id', (req, res, next) => {
    const { error, value } = Joi.validate(req.params, validation.id);
    if(error) return next(error);
    const { id } = req.params;
    return Route.findById(id)
      .then((result) => res.json(result))
      .catch(next);
  });

  app.get('/routes/:id/match', (req, res, next) => {
    const { error, value } = Joi.validate(req.params, validation.id);
    if(error) return next(error);
    const { id } = req.params;

    Route.findById(id)
      .then(route => route ? Route.findMatch(route) : Promise.reject(route))
      .then((result) => res.json(result))
      .catch(next);
  });

  app.post('/routes', (req, res, next) => {
    if(!req.user) next(new Error("This requires an authenticated user!"));
    const { error, value } = Joi.validate(req.body, validation.routeCreate);
    if(error) return next(error);
    const { start, end, route: routeBody } = req.body;
    const route = new Route();
    route.period.start = start;
    route.period.end = end;
    route.route = { type: 'LineString', coordinates: routeBody };
    route.person = req.user._id;

    return route.save()
      .then((result) => res.json(result))
      .catch(next);
  });
};