const routes = require("express").Router();

const Accidents = require('./src/models/Accidents.js');

// burca coordenadas no vgeo e insere no banco de acordo com paramentros informados
routes.get('/accidents', async (req, res) => {
    const response = await new Accidents().getAccidents(req.query);

    res.send(response);
});
// listar acidentes com parametros passados
routes.get('/listaccidents', async (req, res) => {
    const response = await new Accidents().getListAccidents(req.query);

    res.send(response);
});
// retornar coordenadas de br e km
routes.get('/searchCoordinates', async (req, res) => {
    const response = await new Accidents().getCoordinates(req.query);

    res.send(response);
});
//retorna br + km enviando coordenadas
routes.get('/searchBRKM', async (req, res) => {
    const response = await new Accidents().getBRKM(req.query);

    res.send(response);
});

module.exports = routes;