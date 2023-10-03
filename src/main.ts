import express, { type Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerDocument } from './utils/swagger/swagger'
import { corsApp } from './utils/cors/corsApp'
import {Axis} from "./models/axis";
import { Socket } from 'socket.io';
const port: number = 3000
const app = express()
app.use(express.json())
const httpServer: Express = require('http').createServer(app)
const io = require('socket.io')(httpServer, corsApp)
app.use('/docs', swaggerUi.serve, swaggerDocument)


io.on('connection', (socket:Socket) => {
  console.log('a user connected')

  socket.on('message', (message:string) => {
    console.log(message)
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`)
  })

  socket.on('move', (data:Axis) => {
    const { axisX, axisY } = data;
    console.log(`Received move event - Axis X: ${axisX}, Axis Y: ${axisY}`);

  })

  socket.on('removeTreasure', (data:Axis) => {
    const { axisX, axisY } = data;
    console.log(`Received tresure to remove on axis : Axis X: ${axisX}, Axis Y: ${axisY}`);

  })

  socket.on('score', (userId:number) => {

    console.log(`le score de l'user ${userId} est demandé`);
    socket.emit('scoreUser', 10);
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected!')
  })
})

httpServer.listen(port, () => { console.log(`listening on port ${port}`) })
