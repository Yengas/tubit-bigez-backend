const log = require('../../../logger');
const User = require('../../../models/User');
const FB = require('fb');
const validation = require('./validation');
const Joi = require('joi');

// Facebook oauth url generation and user info get.
module.exports = (config) => {
  const { id: client_id, secret: client_secret, scope, fields } = config;

  // Get login url
  function getLoginURL(redirect_uri){
    return Promise.resolve(FB.getLoginUrl({ client_id, redirect_uri, scope }));
  }
  // Generate access token for facebook
  function generateAccessToken(redirect_uri, code){
    return new Promise((resolve, reject) => {
      FB.api('oauth/access_token', {
        client_id,
        client_secret,
        redirect_uri,
        code
      }, function(res){
        if(res.error) return reject(res.error);
        return resolve(res);
      });
    });
  }

  // Extends the given access token
  function extendAccessToken(fb_exchange_token){
    return new Promise((resolve, reject) => {
      FB.api('oauth/access_token', {
        client_id,
        client_secret,
        fb_exchange_token,
        grant_type: 'fb_exchange_token',
      }, function(res){
        if(res.error) return reject(res.error);
        return resolve(res);
      });
    });
  }

  // Returns the profile for the given user.
  function getProfile(access_token){
    FB.setAccessToken(access_token);

    return new Promise((resolve, reject) => {
      FB.api('me', { fields }, function(res){
        if(res.error) return reject(res.error);
        return resolve(res);
      });
    });
  }

  /**
   * Creates or finds a user, given the facebook profile of the user.
   * @param facebook_profile
   * @return {*}
   */
  function createOrFindUser(facebook_profile){
    const { email, name } = facebook_profile;
    const { url: picture } = facebook_profile.picture.data;
    return User.createOrFindWithProfile({ email, profile: { name, picture }});
  }

  return {
    // Login url generation
    login: (body) => {
      const { error, value } = Joi.validate(body, validation.login);
      if(error) return Promise.reject(new Error('Invalid redirect_uri!'));
      const { redirect_uri } = body;

      return getLoginURL(redirect_uri);
    },
    // Get user info!
    callback: (body) =>{
      const { error, value } = Joi.validate(body, validation.callback);
      if(error) return Promise.reject(new Error('Invalid callback data!'));
      const { redirect_uri, code } = body;

      log.info({ body }, 'Facebook callback received!');
      return generateAccessToken(redirect_uri, code)
        .then(res => extendAccessToken(res.access_token))
        .then(res => Promise.all([res, getProfile(res.access_token)]))
        .then(([ res, profile ]) => {
          log.info({ profile }, "Got user profile and access token.");
          return createOrFindUser(profile);
        });
    }
  };
};