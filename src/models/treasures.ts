import {SessionDto} from "../dto/sessions";

export interface TreasuresModelRequest {
    posX: number;
    posY: number;
    session: SessionDto;
}

export interface TreasuresModelUpdate {
    id: number;
    isClaim: boolean;
}
