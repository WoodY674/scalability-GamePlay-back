import {Router, Request, Response} from "express";
import {AppDataSource} from "../utils/database/database.config";
import {SessionsServices} from "../services/sessions/sessions.services";
import {BackgroundRes} from "../models/api";
import {PlayersService} from "../services/players/players.services";
import {TreasuresServices} from "../services/treasures/treasures.services";
import {SessionDto} from "../dto/sessions";
import {TreasuresDto} from "../dto/treasures";
import {Column, JoinColumn, ManyToOne} from "typeorm";
const sessionsServices: SessionsServices = new SessionsServices(AppDataSource);
const playersServices: PlayersService = new PlayersService(AppDataSource);
const treasuresServices: TreasuresServices = new TreasuresServices(AppDataSource);

let SessionController  = Router();

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

/**
 * @TODO handle correctly the swagger
 * @swagger
 * components:
 *   schemas:
 *     Treasure:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the treasure
 *         img:
 *           type: string
 *           description: Url of the treasure image
 *         posX:
 *           type: number
 *           description: treasure's position on x axe
 *         posY:
 *           type: number
 *           description: treasure's position on y axe
 *         value:
 *           type: number
 *           description: Value of the treasure
 *       example:
 *         id: 1
 *         img: https://background/img/1234.png
 *         posX: 1
 *         posY: 1
 *         value: 2
 *     Player:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the player
 *         avatar:
 *           type: string
 *           description: Url of the avatar image
 *         posX:
 *           type: number
 *           description: player's position on x axe
 *         posY:
 *           type: number
 *           description: player's position on y axe
 *         userId:
 *           type: number
 *           description: player's user id
 *       example:
 *         id: 1
 *         avatar: https://avatar/img/1234.png
 *         posX: 1
 *         posY: 1
 *         userId: 1
 *     Map:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the player
 *         background:
 *           type: string
 *           description: Url of the background image
 *         width:
 *           type: number
 *           description: map's maximum on x axe
 *         height:
 *           type: number
 *           description: player's position on y axe
 *       example:
 *         id: 1
 *         background: https://background/img/1234.png
 *         width: 1
 *         height: 1
 *     Session:
 *       type: object
 *       properties:
 *         treasures:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Treasure'
 *         players:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Player'
 *         map:
 *           type: $ref: '#/components/schemas/Map'
 *
 * @swagger
 * /session/launch:
 *   post:
 *     description: Create a new session or get the current one and add a new player.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *               userId:
 *                 type: number
 *             example:
 *               avatar: "http://avatar.com/1234.png"
 *               userId: 1
 *     responses:
 *       201:
 *         description: Utilisateur connecter avec succès
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Session'
 *
 *       500:
 *         description: An Error Occurred
 */
SessionController.post("/launch", async function(req, res){
    //@todo check contains avatar:str + token. img is the avatar selected before starting game.
    const avatar = "" // req.body.avatar
    const userId = 1 //req.body.userId

    try {
        let curr_session:SessionDto
        let treasures: TreasuresDto[]
        let sessions = await sessionsServices.getAll()

        if(sessions.length == 0){ //no session exist
            //@todo : call to service background map
            const bgRes:BackgroundRes = {map:"", width:100, height:100, treasures:[{id:1, posX:1, posY:1, image:"", value:1}]}
            curr_session = await sessionsServices.create({backgroundImg:bgRes.map, width:bgRes.width, height:bgRes.height})

            for (const el of bgRes.treasures) {
                await treasuresServices.create({session:curr_session, posX:el.posX, posY:el.posY, img:el.image, value:el.value })
            }
        }
        else{
            curr_session = sessions[sessions.length-1]
        }

        treasures = await treasuresServices.getAllUnclaimedBySession(curr_session)

        //@todo : call to service avatar
        //const avatarRes = {}
        await playersServices.create({userid:userId, posX:getRndInteger(0, curr_session.width), posY:getRndInteger(0, curr_session.height), session:curr_session, avatar:avatar})
        const players = await playersServices.getAllBySession(curr_session)

        res.status(201).json({
            treasures: treasures,
            players: players,
            map: curr_session
        })
    }catch (e) {
        res.status(500)
    }
})

export default SessionController;