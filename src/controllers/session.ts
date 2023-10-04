import {Router, Request, Response} from "express";
import {AppDataSource} from "../utils/database/database.config";
import {SessionsServices} from "../services/sessions/sessions.services";
import {BackgroundRes} from "../models/api";
import {PlayersService} from "../services/players/players.services";
import {TreasuresServices} from "../services/treasures/treasures.services";
import {SessionDto} from "../dto/sessions";
const sessionsServices: SessionsServices = new SessionsServices(AppDataSource);
const playersServices: PlayersService = new PlayersService(AppDataSource);
const treasuresServices: TreasuresServices = new TreasuresServices(AppDataSource);

let SessionController  = Router();


/**
 * @TODO handle correctly the swagger
 * @swagger
 * /connect/user:
 *   post:
 *     description: Connect un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "john.doe@example.com"
 *               password: "motdepasse"
 *     responses:
 *       200:
 *         description: Utilisateur connecter avec succès
 */
SessionController.post("/launch", async function(req, res){
    //@todo check contains img:str + token. img is the avatar selected before starting game.
    const avatar = ""
    try {
        let curr_session:SessionDto
        let sessions = await sessionsServices.getAll()
        if(sessions === null){ //no session exist
            //@todo : call to service background map
            const bgRes:BackgroundRes = {map:"", width:100, height:100, treasures:[{id:1, posX:1, posY:1, image:"", value:1}]}
            curr_session = await sessionsServices.create({backgroundImg:bgRes.map, scaleX:bgRes.width, scaleY:bgRes.height})

            for (const el of bgRes.treasures) {
                await treasuresServices.create({session:curr_session, posX:el.posX, posY:el.posY, img:el.image, value:el.value })
            }
        }
        else{
            curr_session = sessions[sessions.length-1]
        }
        const treasures = await treasuresServices.getAll()
        //@todo : call to service avatar
        //const bgRes:BackgroundRes = {map:"", width:100, height:100, treasures:[{id:1, posX:1, posY:1, image:"", value:""}]}
        //@todo :
        await playersServices.create({user_id:1, posX:1, posY:1, session:curr_session, avatar:avatar})
        const players = await playersServices.getAll()

        res.status(201).json({
            treasures:treasures,
            players:players,
            map: curr_session
        })
    }catch (e) {
        res.status(500)
    }
})

export default SessionController;