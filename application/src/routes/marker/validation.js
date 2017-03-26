const Joi = require('joi');

module.exports = {
  query: Joi.object().keys({
    point: Joi.array().items(Joi.number()).length(2).required(),
    distance: Joi.number().required()
  })
};