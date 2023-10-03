import {DataSource, Repository} from "typeorm";
import {PlayersDto} from "../../dto/players";
import {TreasuresDto} from "../../dto/treasures";
import {TreasuresModelRequest, TreasuresModelUpdate} from "../../models/treasures";

export class TreasuresServices{
    dataSourceConfig: Promise<DataSource>

    constructor (dataSourceConfig: Promise<DataSource>) {
        this.dataSourceConfig = dataSourceConfig
    }

    async create(treasure : TreasuresModelRequest) {
        try {
            const dataSource: DataSource = await this.dataSourceConfig;
            const treasureRepository: Repository<TreasuresDto> = dataSource.getRepository(TreasuresDto);
            const newSession = treasureRepository.create({
                posX: treasure.posX,
                posY: treasure.posY,
                isClaim: false,
                session: treasure.session
            });
            return await treasureRepository.save(newSession);
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async update(treasure : TreasuresModelUpdate) {
        try {
            const dataSource: DataSource = await this.dataSourceConfig;
            const treasureRepository: Repository<TreasuresDto> = dataSource.getRepository(TreasuresDto);
            return await treasureRepository.save({
                id: treasure.id,
                isClaim: treasure.isClaim
            })
        } catch (error: any) {
            throw new Error(error)
        }
    }


}
