const routes = require("express").Router();

const Accidents = require('./src/models/Accidents.js');

routes.get('/accidents', async (req, res) => {
    const response = await new Accidents().getAccidents(req.query);
  
    res.send(response);
});

module.exports = routes;

