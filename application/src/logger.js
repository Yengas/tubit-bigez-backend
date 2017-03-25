const { name } = require('./config'),
      bunyan = require('bunyan');

module.exports = bunyan.createLogger({ name });