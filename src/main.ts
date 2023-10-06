import express, { type Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerDocument } from './utils/swagger/swagger'
import { corsApp } from './utils/cors/corsApp'
import SessionController from "./controllers/session";
import MetricsController from "./controllers/metrics";
import cors from 'cors';

const port: number = 3001
const app = express()
const httpServer: Express = require('http').createServer(app)
const io = require('socket.io')(httpServer, {cors: corsApp})

app.use(cors(corsApp))
app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerDocument)
app.use('/session', SessionController)
app.use('/metrics', MetricsController)
require("./controllers/socket")(io)

httpServer.listen(port, () => { console.log(`listening on port ${port} ${process.argv[2]}`)
    console.log(process.env)
})

module.exports.ioobject = io;
