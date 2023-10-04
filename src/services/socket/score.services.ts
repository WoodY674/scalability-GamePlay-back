import axios, { AxiosResponse, AxiosError } from 'axios';
import {Scores} from '../../models/scores'
export class ScoreServices{
    async getScore(){
        try {
            const response: AxiosResponse = await axios.get('https://api.example.com/users');
            const scoreData = response.data;
            const score = new Scores(scoreData.id,scoreData.email,scoreData.score,scoreData.avatar)
            console.log('Score data:', score);
            return score
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                console.error('Axios error:', axiosError.message);
            } else {
                console.error('Error:', error);
            }
        }
    }
}
