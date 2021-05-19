const ObjectId = require('mongodb').ObjectID;
const mongo = require('../../bd');
const Vgeo = require('./Vgeo');



class Accidents {

    fitParams(params) {
        if (params.data) {
            params.data = new Date(params.data);
        }
        return params;
    }

    //connect to Mongo
    async connect(){
        try {
            await mongo.connect();
            return mongo.db('accidents_map').collection('accidents');
        } catch (err) {
            console.log(err)
        }
    }

    // busca coordenadas de acordo com br e km
    async getCoordinates({ br, km }) {
        try {
            const vgeo = new Vgeo(); //{ br , uf, data, km }

            const object = { br, uf, data, km };
            const {
                geometry: {
                    coordinates
                }
            } = await vgeo.coordenadas(object);

            return coordinates

        } catch (err) {
            return `erro getCoordinates ${err}`
        }
    }
    // insere no banco coordenadas de lista de acidentes passados por parametro
    async getAccidents(params) {
        try {
            const vgeo = new Vgeo();
            const connection = await this.connect();

            const response = connection
                .find(this.fitParams(params))
                .forEach(async (dados) => {
                    const {
                        data
                    } = dados;
                    dados.data = new Date().toISOString().slice(0, 10);
                    const result = await vgeo.coordenadas(dados);
                    if (result) {

                        connection.updateOne({
                            _id: ObjectId(dados._id)
                        }, {
                            $set: {
                                latitude: result.geometry.coordinates[0][1],
                                longitude: result.geometry.coordinates[0][0],
                            }
                        });

                    } else {
                        return ("Erro ao conectar API");
                    }

                    return response
                });
        } catch (err) {
            return `erro getAccidents ${err}`
        }
    }
// retorna lista de acidentes de acordo com os parametros informados
    async getListAccidents(params) {
        try {
            const connection = await this.connect();
            const response = connection
                .aggregate([{
                        $match: this.fitParams(params)
                    },
                    {
                        $project: {
                            _id: 0,
                            latitude: 1,
                            longitude: 1
                        }
                    }
                ])
                .toArray()
            return response

        } catch (err) {
            return `erro getListAccidentes ${err}`
        }
    }
    //retorna BR + km das coordenadas informada
    /*[{"id":"1","br":"376","sg_tp_trecho":"B","uf":"PR","versao":"202101A","id_trecho":"","km":"577.85770650318477","lat":"-25.443142372410431","lng":"-49.453852674432397"},
        {"id":"2","br":"277","sg_tp_trecho":"B","uf":"PR","versao":"202101A","id_trecho":"","km":"117.2422934968214","lat":"-25.443142372410431","lng":"-49.453852674432397"}]*/
    async getBRKM({ lat, lng }){
        try{
            const vgeo = new Vgeo();
            const obj = { lat, lng };
            const response =  await vgeo.endereco(obj);
            const endereco = response.map(({ br, km }) => ({ br, km }));
        
            return endereco

        }catch(err){
            return `erro getEnderecoBRKM ${err}`
        }
    }


    

}

module.exports = Accidents;