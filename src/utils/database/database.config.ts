import 'reflect-metadata'
import {DataSource} from 'typeorm'
import {PlayersDto} from '../../dto/players'
import {SessionDto} from "../../dto/sessions";
import {TreasuresDto} from "../../dto/treasures";
require('dotenv').config();
const type: "mysql" | "mariadb"  = process.env.MYSQL_TYPE as any ?? 'mysql';
const host : string  = process.env.MYSQL_HOST ?? 'localhost'
const port : number  = Number(process.env.MYSQL_PORT) ?? 3306
const username= process.env.MYSQL_USER ?? 'root'
const password= process.env.MYSQL_PASSWORD ?? 'root'
const database= process.env.MYSQL_DATABASE ?? 'mydb'

export const AppDataSource = new DataSource({
    type: type,
    host: host,
    port: port,
    username: username,
    password: password,
    database:  database,
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
