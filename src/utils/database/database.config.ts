import 'reflect-metadata'
import {DataSource} from 'typeorm'
import {PlayersDto} from '../../dto/players'
import {SessionDto} from "../../dto/sessions";
import {TreasuresDto} from "../../dto/treasures";
require('dotenv').config();
const type : string  = process.env.DB_TYPE ?? 'mysql'

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) ?? 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [
        PlayersDto,
        SessionDto,
        TreasuresDto
    ],
    subscribers: [],
    migrations: []
}).initialize()
