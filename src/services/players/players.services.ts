import {type DataSource, Repository} from 'typeorm'
import {PlayersModelRequest, PlayersModelUpdate} from "../../models/players";
import {PlayersDto} from "../../dto/players";

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
            user_id: player.user_id,
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
