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
        //params.longitude = "";
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


    async getCoordinates(br , km) {
        try {
            const vgeoapi = new VgeoAPI();//{ br , uf, data, km }
            //const connection = await this.connect(); 
            const data = "2021-02-23"
            const uf = "PR"
            const result = await vgeoapi.coordenadas( br , uf, data, km );
            console.log(result)

            return result

        } catch (err) {
            console.log(err)
            return err
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
                        }
                        return response
            });
        } catch (err) {
            console.log(error)
            console.log(err)
            return err
        } finally {
           //console.log(dados._id);
        }
    }

    async getListAccidents(params) {
        try {
            //instancia mongo
            const connection = await this.connect();
            //query mongo
            const response = connection
                .find(this.fitParams(params))
                .toArray()

            return response

        } catch (error) {
            console.log(err)
            return err
        } finally {

        }
    }

}

module.exports = Accidents;
