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

    async connect(){
        try{
            await mongo.connect();
            return mongo.db('accidents_map').collection('accidents');
        } catch (err) {
            console.log(err)
        }
        
    }

    async getAccidents(params) {
        try {
            const vgeoapi = new VgeoAPI();
            const connection = await this.connect();
            const response = connection
                .find(this.fitParams(params))
                //.limit(2)
                .forEach(async (dados) => {
                        const { data } = dados;
                        dados.data = '2021-2-21';
                        const result = await vgeoapi.coordenadas(dados);
                        console.log(result)
                        if(result){

                            // fs.writeFileSync("../coordinates.json", JSON.stringify(result)), (err) => {
                            //     if (err) {
                            //         console.error(err);
                            //         return;
                            //     }; console.log("File has been created");
                            
                            connection.updateOne({
                                _id: ObjectId(dados._id)
                            }, {
                                $set: {
                                    latitude: result.geometry.coordinates[0][1],
                                    longitude: result.geometry.coordinates[0][0],
                                }
                            });
                        } mongo.close();

                        return response
            });
        } catch (error) {
            console.log(error)
        } finally {
           //console.log(dados._id);
           await delay(2000);
        }
    }

    fitParams(params) {
        if(params.data){
            params.data = new Date(params.data);
        }
        //params.longitude = "";
        return params;
    }
}

module.exports = Accidents;
