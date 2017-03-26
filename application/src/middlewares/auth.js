const User = require('../models/User');

/**
 * Returns a function that queries the redis backend for the given token.
 * Present in the header.
 * @param header {String} the header to check for.
 * @param auth {Object} the auth methods to query for tokens.
 * @return {Function} middleware that queries users and puts them to `req.user`
 */
module.exports = (header, auth) => {
  return function(req, res, next){
    const token = req.headers[header];
    if(!token) return next();

    return auth.findToken(token).then((user) => {
      req.user = new User(user);
      next();
    });
  };
};