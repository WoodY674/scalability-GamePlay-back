import {Socket, } from "socket.io";
import {PlayersService} from "../services/players/players.services";
import {AppDataSource} from "../utils/database/database.config";
import {TreasuresServices} from "../services/treasures/treasures.services";
import {SessionsServices} from "../services/sessions/sessions.services";
import {ScoreServices} from "../services/socket/score.services";
import {PlayersModelUpdate} from "../models/players";
import {TreasuresModelOnClaim} from "../models/treasures";

module.exports = (io:any) => {
    const playersService = new PlayersService(AppDataSource);
    const treasuresService = new TreasuresServices(AppDataSource)
    const sessionService = new SessionsServices(AppDataSource)
    const scoreService = new ScoreServices()

    io.on('connection', (socket:Socket) => {
        console.log('a user connected')

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
                io.emit(`moveConfirmed/${player?.session.id}`, player)
            } catch (error) {
                console.error('Error updating player:', error);
            }
        })

        socket.on('claim', async (data:TreasuresModelOnClaim) => {
            console.log(`Received claimed treasure with id: ${data.treasureId}`);

            try {
                const currentTreasure = await treasuresService.getById(data.treasureId)
                const claimedTreasure = await treasuresService.updateClaim({id:data.treasureId, isClaim:true})
                if(claimedTreasure.affected== undefined || claimedTreasure.affected < 1){
                    throw new Error("The treasure wasn't claim")
                }
                console.log('Treasure claimed:', currentTreasure);

                io.emit(`treasureClaimed/${data.sessionId}`, data.treasureId)

                const remainingTreasure = await treasuresService.getAllUnclaimedBySession(data.sessionId)
                if(remainingTreasure.length == 0){
                    io.emit(`endGame/${data.sessionId}`, {});
                    await sessionService.delete(data.sessionId)
                }

                const currentPlayer = await playersService.getByUid(data.userid)
                const score = await scoreService.getScore({id:data.userid, score: currentTreasure!.value, avatar:currentPlayer!.avatar, sessionId: data.sessionId, email:data.userMail});
                io.emit(`score/${data.userid}`, {score:score!.score, userid:data.userid});
            } catch (error) {
                console.log('Error claim treasure:', error)
            }
        })

        socket.on('disconnect', () => {
            console.log('a user disconnected!')
        })
    })
};