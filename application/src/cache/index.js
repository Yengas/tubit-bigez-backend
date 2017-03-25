const bluebird = require('bluebird'),
      redis = require('redis');

// Promisify redis methods with the Async suffix.
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// Redis client connection and related caching storage.
module.exports = (config) => {
  const client = redis.createClient({ host: config.host, port: config.port });

  return {
    client,
    auth: require('./auth')(config.auth, client)
  };
};