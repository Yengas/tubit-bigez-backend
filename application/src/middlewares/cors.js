module.exports = (config) => function(req, res, next) {
  res.header("Access-Control-Allow-Origin", config.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", `Origin, X-Requested-With, Content-Type, Accept, ${config.headers.join(', ')}`);
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
};