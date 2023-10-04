import {Column, CreateDateColumn, JoinColumn, ManyToOne} from "typeorm";
import {SessionDto} from "../dto/sessions";

export interface BackgroundTreasure{
    id: number;
    posX: number;
    posY: number;
    image: string;
    value: number;
}
export interface BackgroundRes {
    map: string;
    width: number;
    height: number;
    treasures: BackgroundTreasure[]
}
