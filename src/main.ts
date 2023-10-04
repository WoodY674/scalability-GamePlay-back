import express, { type Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerDocument } from './utils/swagger/swagger'
import { corsApp } from './utils/cors/corsApp'
import {PlayersModelUpdate} from "./models/players";
import {PlayersService} from "./services/players/players.services";
import {AppDataSource} from "./utils/database/database.config";
import {TreasuresServices} from "./services/treasures/treasures.services";
import {TreasuresModelUpdate} from "./models/treasures";
import {ScoreServices} from "./services/socket/score.services";
import { Socket } from 'socket.io';
import SessionController from "./controllers/session";

const port: number = 3001
const app = express()
app.use(express.json())
const httpServer: Express = require('http').createServer(app)
const io = require('socket.io')(httpServer, corsApp)
app.use('/docs', swaggerUi.serve, swaggerDocument)

app.use('/session', SessionController)

io.on('connection', (socket:Socket) => {
  console.log('a user connected')
  const playersService = new PlayersService(AppDataSource);
  const treasuresService = new TreasuresServices(AppDataSource)
  const scoreService = new ScoreServices()

  socket.on('message', (message:string) => {
    console.log(message)
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`)
  })

  socket.on('move', async (data: PlayersModelUpdate) => {
    console.log(`Received move event - Pos X: ${data.posX}, Pos Y: ${data.posY}, id: ${data.id}`);
    try {
      const updatedPlayer = await playersService.updatePos(data);
      console.log('Player updated:', updatedPlayer);
      io.emit('moveConfirmed', data)
    } catch (error) {
      console.error('Error updating player:', error);
    }
  })

  socket.on('claim', async (data: TreasuresModelUpdate, idPlayer: number) => {
    console.log(`Received tresure to remove with id: ${data.id}`);
    try {
      const claimedTreasurer = await treasuresService.updateClaim(data)
      console.log('Treasurer claimed:', claimedTreasurer);
      io.emit('treasureClaimed', data)
      const score = await scoreService.getScore();
      io.emit('score', score!.score, idPlayer);
    } catch (error) {
      console.log('Error claim treasure:', error)
    }
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected!')
  })
})

httpServer.listen(port, () => { console.log(`listening on port ${port}`) })
