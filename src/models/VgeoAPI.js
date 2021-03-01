const axios = require("axios");
const https = require("https");

class VgeoAPI {
    async coordenadas({ br , uf, data, km }) {

      if(br == 376 && km > 682.9){
          if(km >= 683.5){
            uf = 'SC'
            km = 1
          }else km = 682.9
      }
      if(br == 277 && km == 4.7 || km == 349.3){
        km = km - 0.01;
      }
      if(br == 7 ){
        br = 277
      }

      const instance = axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })

      const error_response = {"type":"Feature","geometry":{"type":"MultiPoint","coordinates":[['NOT FOUND','NOT FOUND']]}};

      try {
          const response = await instance.get(`https://servicos.dnit.gov.br/sgplan/apigeo/rotas/espacializarponto?br=${br}&tipo=B&uf=${uf}&cd_tipo=null&data=${data}&km=${km}`);  
          console.log("ok");
          return response.data;
      } catch (error) {
          //console.error(error);
          console.log("not_found");
          return error_response;
      }

      // instance.get(`https://servicos.dnit.gov.br/sgplan/apigeo/rotas/espacializarponto?br=${br}&tipo=B&uf=${uf}&cd_tipo=null&data=${data}&km=${km}`)
      //         .then(function (response) {
      //           console.log(JSON.stringify(response.data));
      //         })
      //         .catch(function (error) {
      //           console.log(error);
      //         });


        // const headers = {
        //   'Host': 'servicos.dnit.gov.br',
        //   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0',
        //   'Accept': '*/*',
        //   'Accept-Language': 'en-US,en;q=0.5',
        //   'Accept-Encoding': 'gzip, deflate',
        //   'Referer': 'http://servicos.dnit.gov.br/vgeo/',
        //   'Origin': 'http://servicos.dnit.gov.br',
        //   'DNT': '1',
        //   'Connection': 'close'

        //     'Accept': '*/*',
        //     'Accept-Encoding': 'gzip, deflate, br',
        //     'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        //     'Connection': 'keep-alive',
        //     'Host': 'servicos.dnit.gov.br',
        //     'Origin': 'http://servicos.dnit.gov.br',
        //     'Referer': 'http://servicos.dnit.gov.br/',
        //     'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not\\A\"Brand";v="99"',
        //     'sec-ch-ua-mobile': '?1',
        //     'Sec-Fetch-Dest': 'empty',
        //     'Sec-Fetch-Mode': 'cors',
        //     'Sec-Fetch-Site': 'cross-site',
        //     'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Mobile Safari/537.36'
        // };

        // try {
        //   const response = await axios({
        //     url: `https://servicos.dnit.gov.br/sgplan/apigeo/rotas/espacializarponto?br=${br}&tipo=B&uf=${uf}&cd_tipo=null&data=${data}&km=${km}`,
        //     method: "GET",
        //     headers: headers
        //   });
        //   console.log(response)
        //   return response.data

        // } catch (error) {
        //   //console.log(error);
        //   return false
        // }
      }
};

module.exports = VgeoAPI;

