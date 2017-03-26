const mongoose = require('mongoose'),
      log = require('../logger');

const acceptSchema = new mongoose.Schema({
  // The user who accepted the route request.
  person: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // The root which the user would like to participate in
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  // The target person who wants the travel the route.
  companion: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, { timestamps: true });

// Make sure there is only 1 mongoose record for person/route pairs.
acceptSchema.index({ person: 1, route: 1 }, { unique: true });

/**
 * Returns all of the accepted routes ids for a given user_id.
 * @param id {String} the id of the user to make the query for.
 * @return {Promise.<TResult>|Promise}
 */
acceptSchema.statics.routesForUser = function(id){
  return this.find({ person: id })
    .exec()
    .then(results => {
      if(!results || results.length == 0) return Promise.reject();
      return Promise.resolve(results.map(r => r._id));
    })
    .catch(() => Promise.resolve([]))
};

const Accept = mongoose.model('Accept', acceptSchema);
module.exports = Accept;