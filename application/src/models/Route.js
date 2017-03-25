const mongoose = require('mongoose'),
      log = require('../logger');

const routeSchema = new mongoose.Schema({
  person: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  period: {
    start: { type: Date },
    end: { type: Date }
  },
  route: { type: { type: String }, coordinates: { type: [Number], index: '2dsphere' }}
}, { timestamps: true });

const Route = mongoose.model('Route', routeSchema);
module.exports = Route;