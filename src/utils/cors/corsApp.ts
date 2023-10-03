import cors from 'cors'
require('dotenv').config();

export const corsApp = {
  cors: {
    origin: `http://${process.env.CLIENT_HOST}`,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type, Authorization'],
    credentials: true
  }
}
