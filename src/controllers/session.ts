import {Router} from "express";
import {AppDataSource} from "../utils/database/database.config";
import {SessionsServices} from "../services/sessions/sessions.services";
import {BackgroundRes} from "../models/api";
import {PlayersService} from "../services/players/players.services";
import {TreasuresServices} from "../services/treasures/treasures.services";
import {SessionDto} from "../dto/sessions";
import {TreasuresDto} from "../dto/treasures";
import {SessionModelLaunch, SessionModelLaunchRes} from "../models/sessions";
import {Utils} from "../utils/utils";
import {RequestValidation} from "../enum/enum";
import {BackgroundService} from "../services/background/background.service";
import {TokenPayload, TokenType, verifyToken} from "../utils/token";

const sessionsServices: SessionsServices = new SessionsServices(AppDataSource);
const playersServices: PlayersService = new PlayersService(AppDataSource);
const treasuresServices: TreasuresServices = new TreasuresServices(AppDataSource);
const backgroundService = new BackgroundService()
const crypto = require("crypto")
const socket = require('../main');
let SessionController  = Router();

function getRndInteger(min:number, max:number) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

/**
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
 *           type: UUID
 *           description: player's user id
 *       example:
 *         id: 1
 *         avatar: https://avatar/img/1234.png
 *         posX: 1
 *         posY: 1
 *         userId: 21cd7da4-9398-480a-a4ef-d8ea6e7fafb1
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
 *           allOf:
 *             - $ref: '#/components/schemas/Map'
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
 *                 type: UUID
 *             example:
 *               avatar: "http://avatar.com/1234.png"
 *               userId: 21cd7da4-9398-480a-a4ef-d8ea6e7fafb1
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
    //region token handling
    const token = req.headers.authorization
    if(token == undefined){
        return res.status(401).json({msg:"No token provided"})
    }
    let payload: TokenPayload = {userId:"", mail:""}
    try {
        payload = verifyToken(token, (process.env.NEXT_PUBLIC_IS_LOCAL == "true" ? TokenType.Fake : TokenType.Real))
    }catch (e){
        return res.status(403).json({msg:e})
    }
    //endregion

    //region check req body
    const body:SessionModelLaunch = {
        avatar: "",
        userId: payload.userId
    }
    const checkingBody = Utils.validBodyRequest(req, body)
    switch (checkingBody){
        case RequestValidation.NO_BODY:
            return res.status(400).json({msg:"No body provided, should contains 'avatar':str and 'userId':int"})
        case RequestValidation.MISSING_PROPERTIES:
            return res.status(400).json({msg:"Body should contains 'avatar':str and 'userId':int"})
        case RequestValidation.WRONG_TYPE:
            return res.status(400).json({msg:"Bad type of data, 'avatar' should be str and 'userId' should be int"})
    }

    body.avatar = req.body.avatar
    body.userId = payload.userId //req.body.userId
    //endregion

    try {
        let currSession:SessionDto
        let treasures: TreasuresDto[]
        let sessions = await sessionsServices.getAll()

        if(sessions.length == 0){ //no session exist
            let bgRes:BackgroundRes
            try{
                bgRes = await backgroundService.getBackGround()
            }catch (e){
                bgRes = {map:"", width:500, height:500, treasures:[{id:1, posX:getRndInteger(0, 500), posY:getRndInteger(0, 500), image:"", value:1}, {id:2, posX:getRndInteger(0, 500), posY:getRndInteger(0, 500), image:"", value:3}]}
            }
            currSession = await sessionsServices.create({backgroundImg:bgRes.map, width:bgRes.width, height:bgRes.height})

            for (const el of bgRes.treasures) {
                await treasuresServices.create({session:currSession, posX:el.posX, posY:el.posY, img:el.image, value:el.value })
            }
        }
        else{
            currSession = sessions[sessions.length-1]
        }

        treasures = await treasuresServices.getAllUnclaimedBySession(currSession.id)

        let currPlayer = await playersServices.getByUid(body.userId) // for case the user reconnect
        if(currPlayer == null){
            await playersServices.create({userid:body.userId, posX:getRndInteger(0, currSession.width), posY:getRndInteger(0, currSession.height), session:currSession, avatar:body.avatar})
            currPlayer = await playersServices.getByUid(body.userId)
            if(currPlayer == null){
                return res.status(500).json({msg:"Player wasn't created"})
            }
            socket.ioobject.sockets.emit(`newPlayer/${currSession.id}`, currPlayer);
        }
        const players = await playersServices.getOtherPlayersBySession(currSession, currPlayer.id)

        const resBody : SessionModelLaunchRes = {
            treasures: treasures,
            players: players,
            map: currSession,
            currentPlayer: currPlayer
        }
        res.status(201).json(resBody)
    }catch (e) {
        res.status(500)
    }
})

export default SessionController;