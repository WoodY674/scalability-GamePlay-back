import cors from 'cors'

require('dotenv').config();

export const corsApp = {
    origin: `${process.env.CORS_ORIGIN}`,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type, Authorization'],
    credentials: true
}
