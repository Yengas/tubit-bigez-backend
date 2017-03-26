const Joi = require('joi');

module.exports = {
  login: Joi.object().keys({
    redirect_uri: Joi.string().uri({ scheme: ['http', 'https']}).required(),
  }),
  callback: Joi.object().keys({
    redirect_uri: Joi.string().uri({ scheme: ['http', 'https']}).required(),
    code: Joi.string().required()
  })
};