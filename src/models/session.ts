import {Column} from "typeorm";

export interface SessionModelRequest {
    backgroundImg: string;
    scaleX: number;
    scaleY: number;
    isSessionOpen: boolean;
}

export interface SessionModelFrontend{
    scaleX: number;
    scaleY: number;
    backgroundImg: string;
}
