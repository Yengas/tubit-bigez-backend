const crypto = require('crypto');

function generateToken(secret, user_id){
  return Promise.resolve(
    crypto.createHmac('sha1', secret).update(user_id.toString() + new Date().getTime() + Math.random()).digest('hex')
  );
}
// Token auth storage backed by redis.
module.exports = (config, redis) => {
  /**
   * Find the given token in redis store.
   * @param token {String} to find in the storage backend.
   * @return {Promise}
   */
  function findToken(token){
    const key = `${config.key}:${token}`;
    return redis.getAsync(key).then(res => res ? Promise.resolve(JSON.parse(res)) : res.reject('Key not found in cache.'));
  }

  /**
   * Create and store an auth token for the user.
   * @param user {Object} the user object that holds _id
   * @return {Promise}
   */
  function createToken(user){
    return generateToken(config.secret, user._id)
      .then((token) => {
        const key = `${config.key}:${token}`;
        // Set the redis key with the auth meta data and user.
         return redis.multi()
           .set(key, JSON.stringify(user))
           .expireat(key, parseInt((+new Date)/1000) + config.expire)
           .execAsync()
            // Resolve the generated token after successfull redis set.
           .then(() => Promise.resolve(token));
      });
  }

  return {
    findToken,
    createToken
  }
};
