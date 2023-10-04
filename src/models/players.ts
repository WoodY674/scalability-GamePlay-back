import {SessionDto} from "../dto/sessions";

export interface PlayersModelRequest {
    userid: number
    session: SessionDto
    avatar: string
    posX: number
    posY: number
}


export interface PlayersModelUpdate {
    id: number
    posX: number
    posY: number
}
