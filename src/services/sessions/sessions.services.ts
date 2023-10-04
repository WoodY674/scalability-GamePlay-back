import {DataSource, Repository} from "typeorm";
import {SessionDto} from "../../dto/sessions";
import {Utils} from "../../utils/utils";
import {SessionModelRequest} from "../../models/sessions";
import {RequestValidation} from "../../enum/enum";
import {CustomMessageRequest} from "../../utils/message/custum.message";
import {TreasuresDto} from "../../dto/treasures";
import {PlayersDto} from "../../dto/players";

export class SessionsServices{
    dataSourceConfig: Promise<DataSource>

    constructor (dataSourceConfig: Promise<DataSource>) {
        this.dataSourceConfig = dataSourceConfig
    }

    async create(session:SessionModelRequest) {
        try {
            const dataSource: DataSource = await this.dataSourceConfig;
            const sessionRepository: Repository<SessionDto> = dataSource.getRepository(SessionDto);
            const newSession = sessionRepository.create({
                backgroundImg: session.backgroundImg,
                scaleX: session.scaleX,
                scaleY: session.scaleY
            });
            return await sessionRepository.save(newSession);
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async getAll() {
        try {
            const dataSource: DataSource = await this.dataSourceConfig;
            const sessionRepository: Repository<SessionDto> = dataSource.getRepository(SessionDto);
            return await sessionRepository.find();
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async delete(id: number) {
        try {
            const dataSource: DataSource = await this.dataSourceConfig;
            const sessionRepository: Repository<SessionDto> = dataSource.getRepository(SessionDto);
            return await sessionRepository.delete(id);
        } catch (error: any) {
            throw new Error(error)
        }
    }
}
