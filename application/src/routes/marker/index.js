const Marker = require('../../models/Marker');
const validation = require('./validation');
const Joi = require('joi');

module.exports = function(app){
  app.get('/markers', (req, res, next) => {
    Marker.list()
      .then((result) => res.json(result))
      .catch(next);
  });

  app.post('/markers/query', (req, res, next) => {
    console.log(req.body);
    const { error, value } = Joi.validate(req.body, validation.query);
    if(error) return next(error);
    const { point, distance } = req.body;
    Marker.query(point, distance)
      .then((result) => res.json(result))
      .catch(next);
  });
};