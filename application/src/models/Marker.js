const mongoose = require('mongoose'),
      log = require('../logger');

const markerSchema = new mongoose.Schema({
  name: { type: String },
  rating: { type: Number },
  description: { type: String },
  location: { type: { type: String}, coordinates: { type: [Number], index: '2dsphere' }}
}, { timestamps: false });

markerSchema.statics.list = function(){
  return this.find({}).exec();
};

/**
 * Finds the markers which are near to the given point.
 * Distance may be configured.
 * @param point {Array} lat/long of the point on the map.
 * @param distance {Number} maxDistance of the markers to the point in meters.
 * @return {Promise}
 */
markerSchema.statics.query = function(point, distance){
  const geojson = { type: 'Point', coordinates: point };
  return this.find({ location: { $near: { $geometry: geojson , $maxDistance: distance }}}).exec();
};

const Marker = mongoose.model('Marker', markerSchema);
module.exports = Marker;