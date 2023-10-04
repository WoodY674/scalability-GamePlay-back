import {Column} from "typeorm";
import {TreasuresDto} from "../dto/treasures";
import {PlayersDto} from "../dto/players";
import {SessionDto} from "../dto/sessions";

export interface SessionModelRequest {
    backgroundImg: string;
    width: number;
    height: number;
}

export interface SessionModelFrontend{
    width: number;
    height: number;
    backgroundImg: string;
}
