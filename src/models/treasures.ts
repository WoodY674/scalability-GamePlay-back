import {SessionDto} from "../dto/sessions";

export interface TreasuresModelRequest {
    posX: number;
    posY: number;
    session: SessionDto;
    img: string;
    value:number;
}

export interface TreasuresModelUpdate {
    id: number;
    isClaim: boolean;
}

export interface TreasuresModelOnClaim {
    treasureId: number;
    userid: string;
    userMail: string;
    sessionId: number;
}
