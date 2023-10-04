import {type DataSource, Repository} from 'typeorm'
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

    async getAllBySession(curr_session:SessionDto) {
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
                    session:curr_session
                }});
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async updatePos(player: PlayersModelUpdate) {
      try {
        const dataSource: DataSource = await this.dataSourceConfig;
        const playerRepository: Repository<PlayersDto> = dataSource.getRepository(PlayersDto);
        return await playerRepository.save({
            id: player.id,
            posX: player.posX,
            posY: player.posY
        })
      } catch (error: any) {
        throw new Error(error)
      }
    }
}
