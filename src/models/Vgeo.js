const axios = require("axios");
const https = require("https");

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  baseUrl: 'https://servicos.dnit.gov.br/sgplan/apigeo/'
})

class VgeoAPI {
  async coordenadas({ br, km }) {

    let date = new Date().toISOString().slice(0, 10);
    const uf = "PR";
    // preencher com not found coordenadas que nao forem encontrada de acordo com br e km
    const error_response = {
      "type": "Feature",
      "geometry": {
        "type": "MultiPoint",
        "coordinates": [
          ['NOT FOUND', 'NOT FOUND']
        ]
      }
    };

    try {
      const response = await instance.get(`rotas/espacializarponto?br=${br}&tipo=B&uf=${uf}&cd_tipo=null&data=${date}&km=${km}`);
      return response.data;
    } catch (error) {
      return error_response;
    }
  }

  async endereco({ lat, lng }) {

    let date = new Date().toISOString().slice(0, 10);
    try {
      const response = await instance.get(`rotas/localizarkm?lng=${lng}&lat=${lat}&r=250&data=${date}`);
      return response.data;
    } catch (error) {
      return error_response;
    }
  }

};

module.exports = VgeoAPI;