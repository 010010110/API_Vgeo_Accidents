//const ObjectId = require('mongodb').ObjectId;
//const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const mongo = require('../../bd');
const VgeoAPI = require ('./VgeoAPI');
const fs = require('fs');


function delay(t, val) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve(val);
        }, t);
    });
 }

class Accidents {

    fitParams(params) {
        if(params.data){
            params.data = new Date(params.data);
        }
        return params;
    }

    //function call connet to Mongo
    async connect(){
        try{
            await mongo.connect();
            return mongo.db('accidents_map').collection('accidents');
        } catch (err) {
            console.log(err)
        }
    }


    async getCoordinates({ br , km }) {
        try {
            const vgeoapi = new VgeoAPI();//{ br , uf, data, km }
            const data = "2021-2-28";
            const uf = "PR";
            const object = { br , uf, data, km };
            const { geometry: { coordinates } } = await vgeoapi.coordenadas( object );

            return coordinates

        } catch (err) {
            return `erro getCoordinates ${err}`
        }
    }

    async getAccidents(params) {
        try {
            const vgeoapi = new VgeoAPI();
            const connection = await this.connect();

            const response = connection
                .find(this.fitParams(params))
                .forEach(async (dados) => {
                        const { data } = dados;
                        dados.data = '2021-2-21';
                        const result = await vgeoapi.coordenadas(dados);
                        if(result){

                            // fs.writeFileSync("../coordinates.json", JSON.stringify(result)), (err) => {
                            //     if (err) {
                            //         console.error(err);
                            //         return;
                            // }; console.log("File has been created");

                            connection.updateOne({
                                _id: ObjectId(dados._id)
                            }, {
                                $set: {
                                    latitude: result.geometry.coordinates[0][1],
                                    longitude: result.geometry.coordinates[0][0],
                                }
                            });

                        }else{
                            return ("Erro ao conectar API");
                        }

                        return response
            });
        } catch (err) {
            return `erro getAccidents ${err}`
        }
    }

    async getListAccidents(params) {
        try {
            const connection = await this.connect();
            const response = connection
                .aggregate([
                    { $match: this.fitParams(params) },
                    { $project: { _id: 0, latitude: 1, longitude: 1 } }
                ])
                .toArray()
            return response

        } catch (err) {
            return `erro getListAccidentes ${err}`
        }
    }

}

module.exports = Accidents;
