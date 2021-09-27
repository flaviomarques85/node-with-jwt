const mongoose =  require('mongoose')

class Connection{
    constructor() {
        this.dataBaseConnectionMongoDB()
    }

    dataBaseConnectionMongoDB(){
        const uri =  "mongodb+srv://admin:67kBxT2qunq8@dev-aws-nodejs.r7l6s.mongodb.net/nodejs?retryWrites=true&w=majority"
        this.mongoDBConnection =  mongoose.connect(uri, {
            
        })
        .then( () => {
            console.log("Conexao com Bando de dados MongoDB com sucesso!")
        })
        .catch( (error) => {
            console.log(`Erro ao Conectar com o MongoDB : ${error}`)
        })

        
    }
}

module.exports = new Connection()