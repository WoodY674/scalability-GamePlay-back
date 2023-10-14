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
