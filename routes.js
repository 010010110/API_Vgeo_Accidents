const routes = require("express").Router();

const Accidents = require('./src/models/Accidents.js');

routes.get('/accidents', async (req, res) => {
    const response = await new Accidents().getAccidents(req.query);
  
    res.send(response);
});

routes.get('/listaccidents', async (req, res) => {
    const response = await new Accidents().getListAccidents(req.query);
  
    res.send(response);
});

routes.get('/searchCoordinates/:br&km', async (req, res) => {
    const response = await new Accidents().getCoordinates(req.query);
  
    res.send(response);
});

module.exports = routes;

