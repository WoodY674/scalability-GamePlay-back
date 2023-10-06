import axios, { AxiosResponse, AxiosError } from 'axios';
import {Scores} from '../../models/scores'
export interface PostBody{
    id: number,
    email: string,
    avatar: string,
    score: number,
    sessionId: number,
}

export class ScoreServices{
    host = "http://" + (process.env.SERVICE_SCORE ?? "serviceScore")

    async getScore(body:PostBody) : Promise<Scores>{
        try {
            const response: AxiosResponse = await axios.post(`${this.host}/ranking`, body);
            const scoreData = response.data;
            console.log('Score data:', scoreData);
            return scoreData
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                console.error('Axios error:', axiosError.message);
            } else {
                console.error('Error:', error);
            }
            throw error
        }
    }
}
