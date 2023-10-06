import 'reflect-metadata'
import {DataSource} from 'typeorm'
import {PlayersDto} from '../../dto/players'
import {SessionDto} from "../../dto/sessions";
import {TreasuresDto} from "../../dto/treasures";
require('dotenv').config();
const type : string  = process.env.DB_TYPE ?? 'mysql'

export const AppDataSource = new DataSource({
    type: 'mariadb',//process.env.DB_TYPE ?? 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) ?? 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true,
    //logging: true,
    entities: [
        PlayersDto,
        SessionDto,
        TreasuresDto
    ],
    subscribers: [],
    migrations: []
}).initialize()
