import {SessionDto} from "../dto/sessions";

export interface PlayersModelRequest {
    userid: string
    session: SessionDto
    avatar: string
    posX: number
    posY: number
}


export interface PlayersModelUpdate {
    userid: string
    posX: number
    posY: number
}
