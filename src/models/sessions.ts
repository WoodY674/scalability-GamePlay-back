import {Column} from "typeorm";

export interface SessionModelRequest {
    backgroundImg: string;
    scaleX: number;
    scaleY: number;
}

export interface SessionModelFrontend{
    scaleX: number;
    scaleY: number;
    backgroundImg: string;
}
