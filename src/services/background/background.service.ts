import axios, {AxiosError, AxiosResponse} from "axios/index";
import {Scores} from "../../models/scores";
import {BackgroundRes} from "../../models/api";

export class BackgroundService{
    async getBackGround(){
        try {
            const response = await axios.get('https://api.example.com/users');
            const backgroundData : BackgroundRes = response.data;
            return backgroundData
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
