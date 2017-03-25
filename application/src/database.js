const mongoose = require('mongoose');

/**
 * A helper method to initialize and listen for mongodb connection.
 * @param config {Object} for the mongodb connection.
 * @return {Promise}
 */
module.exports = (config) => {
  mongoose.Promise = Promise;
  mongoose.connect(config.url);
  const { connection } = mongoose;

  // Returns a promise that resolves on mongodb connect
  // rejects on mongodb error
  return new Promise((resolve, reject) => {
    connection.on('error', reject);
    connection.once('open', resolve);
  });
};