import {type DataSource, Not, Repository} from 'typeorm'
import {PlayersModelRequest, PlayersModelUpdate} from "../../models/players";
import {PlayersDto} from "../../dto/players";
import {TreasuresDto} from "../../dto/treasures";
import {SessionDto} from "../../dto/sessions";

export class PlayersService {
    dataSourceConfig: Promise<DataSource>

    constructor(dataSourceConfig: Promise<DataSource>) {
        this.dataSourceConfig = dataSourceConfig
    }

    async create(player: PlayersModelRequest) {
      try {
        const dataSource: DataSource = await this.dataSourceConfig;
        const playerRepository: Repository<PlayersDto> = dataSource.getRepository(PlayersDto);
        const newPlayer = playerRepository.create({
            userid: player.userid,
            session: player.session,
            avatar: player.avatar,
            posX: player.posX,
            posY: player.posY
        });
        return await playerRepository.save(newPlayer);
      } catch (error: any) {
        throw new Error(error)
      }
    }

    async getByUid(uid:number) {
        try {
            const dataSource: DataSource = await this.dataSourceConfig;
            const playerRepository: Repository<PlayersDto> = dataSource.getRepository(PlayersDto);
            return await playerRepository.findOne({
                select:{
                    id: true,
                    userid: true,
                    avatar: true,
                    posX: true,
                    posY: true,
                },
                where:{
                    userid: uid
                }});
        } catch (error: any) {
            throw new Error(error)
        }
    }
    async getOtherPlayersBySession(currSession:SessionDto, currUserId:number) {
        try {
            const dataSource: DataSource = await this.dataSourceConfig;
            const playerRepository: Repository<PlayersDto> = dataSource.getRepository(PlayersDto);
            return await playerRepository.find({
                select:{
                    id: true,
                    userid: true,
                    avatar: true,
                    posX: true,
                    posY: true,
                },
                where:{
                    session:currSession,
                    id: Not(currUserId)
                }});
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async updatePos(player: PlayersModelUpdate) {
      try {
        const dataSource: DataSource = await this.dataSourceConfig;
        const playerRepository: Repository<PlayersDto> = dataSource.getRepository(PlayersDto);
        return await playerRepository.update({userid:player.id}, {posY:player.posY, posX:player.posX})
      } catch (error: any) {
        throw new Error(error)
      }
    }
}
