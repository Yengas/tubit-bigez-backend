const Route = require('../../models/Route'),
      Accept = require('../../models/Accept'),
      validation = require('./validation'),
      Joi = require('joi');

/**
 * Creates a meaningful notification to a route owner, notifiying that
 * someone is interested to work with them.
 * @param acceptInfo {Object} an object that holds info about the route owner and the route.
 * @param user {Object} user who is interested to travel with the owner.
 * @param acceptRecord {Object} an accept record created for this event.
 * @return {string} the notification message to send to the route owner.
 */
function createAcceptNotification(acceptInfo, user, acceptRecord){
  const { companion, route } = acceptInfo;
  return `Merhabalar sevgili ${companion.profile.name},
Bu maili sana sitemiz üzerinde oluşturduğun gezme planı ile ilgilenen bir yoldaşın olduğu için atıyoruz. Kendisine ${user.email} adresinden erişebilirsin.`;
}

module.exports = (app, options = {}) => {
  const { mail } = options;

  // Set the notification to either mailing or noop by checking the options.
  const notification = mail ? mail.single : () => {};

  app.get('/routes/:id', (req, res, next) => {
    const { error, value } = Joi.validate(req.params, validation.id);
    if(error) return next(error);
    const { id } = req.params;
    return Promise.all([
      Route.findById(id),
      req.user ? req.user.hasAccepted(id) : Promise.resolve(false)
    ]).then(([result, accepted]) => res.json(Object.assign(result.toObject(), { accepted })))
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

  app.get('/routes/:id/accept', (req, res, next) => {
    if(!req.user) return next(new Error("This requires an authenticated user!"));
    const { error, value } = Joi.validate(req.params, validation.id);
    if(error) return next(error);
    const { id } = req.params;

    // Populate the route by person so we can send notifications.
    Route.findById(id).populate('person')
      // If no route is found with the given id, reject, else prepare data
      .then(route => route ? Promise.resolve({ companion: route.person, person: req.user._id, route: route }) : Promise.reject('Route not found!'))
      // Create an Accept record with the last promise's result.
      .then(acceptInfo => {
        return new Accept(acceptInfo)
          .save()
          .then((result) => {
            notification(createAcceptNotification(acceptInfo, req.user, result), acceptInfo.companion.email);
            return Promise.resolve(result);
          });
      })
      .then(result => res.json(result))
      .catch(next);
  });


  app.post('/routes', (req, res, next) => {
    if(!req.user) return next(new Error("This requires an authenticated user!"));
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