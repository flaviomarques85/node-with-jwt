const express =  require('express')
const cors =  require('cors')
const morgan = require('morgan')
const routes = require('./routes')

require('./config/connection')

class App {
    constructor(){
        this.app = express();
        this.middlewares();
        this.routes()
    }

    middlewares(){
        this.app.use(express.json())
        this.app.use(morgan('dev'))
    }

    routes(){
        this.app.use(routes)
    }
}

module.exports = new App().app