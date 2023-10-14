import {TreasuresDto} from "../dto/treasures";
import {PlayersDto} from "../dto/players";
import {SessionDto} from "../dto/sessions";

export interface SessionModelRequest {
    backgroundImg: string;
    width: number;
    height: number;
}

export interface SessionModelLaunch{
    avatar: string;
}

export interface SessionModelLaunchRes{
    treasures: TreasuresDto[];
    players: PlayersDto[];
    map: SessionDto;
    currentPlayer: PlayersDto;
}
