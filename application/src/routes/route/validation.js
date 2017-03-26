const Joi = require('joi');

module.exports = {
  id: Joi.object().keys({ id: Joi.string().required() }),
  routeCreate: Joi.object().keys({
    start: Joi.date().required(),
    end: Joi.date().required(),
    route: Joi.array().items(Joi.array().items([Joi.number().required(), Joi.number().required()]).min(2).required()).min(2).required()
  })
};