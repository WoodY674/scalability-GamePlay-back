import {DataSource, Repository} from "typeorm";
import {SessionDto} from "../../dto/sessions";
import {SessionModelRequest} from "../../models/sessions";

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
                width: session.width,
                height: session.height
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
