module.exports = () =>{
  return function(err, req, res, next){
    res.status(500);
    res.json({ error: true, message: err.message });
  };
};