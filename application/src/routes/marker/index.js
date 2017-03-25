const Marker = require('../../models/Marker');

module.exports = function(app){
  app.get('/markers', (req, res, next) => {
    Marker.list()
      .then((result) => res.json(result))
      .catch(next);
  });

  app.post('/markers/query', (req, res, next) => {
    const { point, distance } = req.body;
    Marker.query(point, distance)
      .then((result) => res.json(result))
      .catch(next);
  });
};