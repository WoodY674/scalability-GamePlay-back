export class Scores{
    id: number;
    email: string;
    score: number;
    avatar: string;

    constructor(id:number, email:string, score: number, avatar:string) {
        this.id = id;
        this.email = email;
        this.score = score;
        this.avatar = avatar
    }
}
