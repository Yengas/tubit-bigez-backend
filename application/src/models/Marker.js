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

markerSchema.statics.query = function(point, distance){
  const geojson = { type: 'Point', coordinates: point };
  return this.find({ location: { $near: { $geometry: geojson , $maxDistance: distance }}}).exec();
};

const Marker = mongoose.model('Marker', markerSchema);
module.exports = Marker;