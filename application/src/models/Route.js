const mongoose = require('mongoose'),
      log = require('../logger');

const routeSchema = new mongoose.Schema({
  person: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  period: {
    start: { type: Date },
    end: { type: Date }
  },
  route: { type: { type: String, default: 'LineString' }, coordinates: { type: [[Number]], index: '2dsphere' }}
}, { timestamps: true });

const defaultOptions = {
  elasticity: { end: 1000 * 60 * 60 * 2, start: 0 },
  factor: { intersect: 0.7, time: 0.3 },
  timeScore: { match: 1, semi_match: 0.7, intersect: 0.5 }
};

/**
 * Finds the matches for the given route and scores the matches. Then sorts them.
 * @param route {Object} the route to find matches for.
 * @param elasticity {Object} the elasticity factor to flex the time range for the given record.
 * @param factor{Object} factors for how much the time and route intersection handles the score.
 * @param timeScore {Object} the hardcoded values of how much different time matching cases effect the score calculation.
 * @return {Promise}
 */
routeSchema.statics.findMatch = function(route, { elasticity, factor, timeScore } = defaultOptions){
  // Create a router object which flexed with the given elasticity parameters
  route = Object.assign({
    _id: route._id,
    person: route.person,
    period: Object.assign(
      { start: route.period.start, end: route.period.end },
      {
        elast_start: new Date(route.period.start.getTime() - elasticity.start),
        elast_end: new Date(route.period.end.getTime() + elasticity.end)
      }
    ),
    coordinates: [...route.route.coordinates]
  });
  // Elasticize the start and end dates of the route

  return this.aggregate([
    // Filter by the time period + elasticity, != this._id.
    { $match:
      { $and: [
        // We're not interested in this record.
        { _id: { $ne: route._id }, person: { $ne: route.person }},
        // If the time of the record in the database matches with the flexed time of the given record.
        { $or: [
          { 'period.end': { $gte: route.period.elast_start }},
          { 'period.start': { $lte: route.period.elast_end }}
        ]},
        // Checks if the route in the database intersects with the route of the given record.
        { route: { $geoIntersects: { $geometry: { type: 'LineString', coordinates: route.coordinates }}}}
      ]}
    },
    // Project the intersection of this route's route coords and the aggregate's routes.
    { $project: { person: 1, route: 1, start: '$period.start', end: '$period.end', intersection: { $setIntersection: ['$route.coordinates', route.coordinates]}, } },
    // Calculate the match score of the records.
    { $project:
      {
        person: 1, route: 1, period: { start: '$start', end: '$end' }, intersection: 1,
        score: {
          $add: [
            // Multiply the intersection percent with the factor.intersect to calculate intersection count's relevance to overall score
            { $multiply: [ { $divide: [ { $size: '$intersection' }, route.coordinates.length ] }, factor.intersect ] },
            // Multiply the time match score with the factor.time to calculate time matching score's relevance to overall score.
            { $multiply: [ {
              $switch: {
                branches: [
                  // If the given record's time contains the time of the record in the database, we're a match.
                  { case: { $and: [ { $gte: [ '$start', route.period.start ]}, { $lte: ['$end', route.period.end]} ] }, then: timeScore.match},
                  // If the database record's time contains the time of the record given, half match
                  { case: { $and: [ { $lte: ['$start', route.period.start]}, { $gte : ['$end', route.period.end] } ] }, then: timeScore.semi_match}
                ],
                // Otherwise there is an intersection that require complex arithmetics
                // TODO: better calculate this case's score.
                default: timeScore.intersect
              }
            }, factor.time ]}
          ]
        }
      }
    },
    { $lookup: { from: 'users', localField: 'person', foreignField: '_id', as: 'person' }},
    // Sort by the score of the records.
    { $sort: { score: -1 }},
  ]).exec();
};

const Route = mongoose.model('Route', routeSchema);
module.exports = Route;