import express, { type Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerDocument } from './utils/swagger/swagger'
import { corsApp } from './utils/cors/corsApp'
import SessionController from "./controllers/session";
const cors = require('cors');

const port: number = 3001
const app = express()
const httpServer: Express = require('http').createServer(app)
const io = require('socket.io')(httpServer, corsApp)

app.use(cors({origin:"*"}))
app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerDocument)
app.use('/session', SessionController)
//app.use(require("/src/controllers/socket")(io))
require("./controllers/socket")(io)


httpServer.listen(port, () => { console.log(`listening on port ${port}`) })

module.exports.ioobject = io;
