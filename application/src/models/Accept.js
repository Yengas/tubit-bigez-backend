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

const Accept = mongoose.model('Accept', acceptSchema);
module.exports = Accept;