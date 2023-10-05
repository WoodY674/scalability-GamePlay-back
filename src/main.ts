import express, { type Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerDocument } from './utils/swagger/swagger'
import { corsApp } from './utils/cors/corsApp'
import {PlayersModelUpdate} from "./models/players";
import {PlayersService} from "./services/players/players.services";
import {AppDataSource} from "./utils/database/database.config";
import {TreasuresServices} from "./services/treasures/treasures.services";
import {TreasuresModelOnClaim, TreasuresModelUpdate} from "./models/treasures";
import {ScoreServices} from "./services/socket/score.services";
import { Socket } from 'socket.io';
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
    console.log(`Received move event - Pos X: ${data.posX}, Pos Y: ${data.posY}, userid: ${data.userid}`);
    try {
      const updatedPlayer = await playersService.updatePos(data);
      const player = await playersService.getByUid(data.userid);
      console.log('Player updated:', updatedPlayer, player);
      io.emit('moveConfirmed', player)
    } catch (error) {
      console.error('Error updating player:', error);
    }
  })

  socket.on('claim', async (data:TreasuresModelOnClaim) => {
    console.log(`Received tresure to remove with id: ${data.treasureId}`);
    try {
      const claimedTreasurer = await treasuresService.updateClaim({id:data.treasureId, isClaim:true})
      console.log('Treasurer claimed:', claimedTreasurer);
      io.emit('treasureClaimed', data.treasureId)
      //io.emit('endGame')
      io.emit('score', {score:5, userid:data.userid});

      const score = await scoreService.getScore();
      io.emit('score', {score:score!.score, userid:data.userid});
    } catch (error) {
      console.log('Error claim treasure:', error)
    }
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected!')
  })
})

httpServer.listen(port, () => { console.log(`listening on port ${port}`) })

module.exports.ioobject = io;
