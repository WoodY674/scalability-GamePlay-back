import {type DataSource, Repository} from 'typeorm'
import {PlayersModelRequest, PlayersModelUpdate} from "../../models/players";
import {SessionDto} from "../../dto/sessions";
import {PlayersDto} from "../../dto/players";
import {SessionModelRequest} from "../../models/sessions";

export class PlayersService {
    dataSourceConfig: Promise<DataSource>

    constructor(dataSourceConfig: Promise<DataSource>) {
        this.dataSourceConfig = dataSourceConfig
    }

    async create(player: PlayersModelRequest) {
      try {
        const dataSource: DataSource = await this.dataSourceConfig;
        const playerRepository: Repository<PlayersDto> = dataSource.getRepository(PlayersDto);
        const newSession = playerRepository.create({
            user_id: player.user_id,
            session: player.session,
            avatar: player.avatar,
            posX: player.posX,
            posY: player.posY
        });
        return await playerRepository.save(newSession);
      } catch (error: any) {
        throw new Error(error)
      }
    }

    async update(player: PlayersModelUpdate) {
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

    async delete(id: number) {
      try {
        const dataSource: DataSource = await this.dataSourceConfig;
        const playerRepository: Repository<PlayersDto> = dataSource.getRepository(PlayersDto);
        return await playerRepository.delete(id);
      } catch (error: any) {
        throw new Error(error)
      }
    }
}
