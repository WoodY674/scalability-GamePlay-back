import axios, {AxiosError} from "axios";
import {BackgroundRes} from "../../models/api";

export class BackgroundService{
    //@TODO : get the background service route
    host = process.env.SERVICE_BACKGROUND

    async getBackGround() : Promise<BackgroundRes>{
        try {
            const response = await axios.get(`${this.host}/background`);
            return response.data
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
