import {DataSource, Repository} from "typeorm";
import {PlayersDto} from "../../dto/players";
import {TreasuresDto} from "../../dto/treasures";
import {TreasuresModelRequest, TreasuresModelUpdate} from "../../models/treasures";
import {SessionDto} from "../../dto/sessions";

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
                img: treasure.img,
                value: treasure.value,
                isClaim: false,
                session: treasure.session,
            });
            return await treasureRepository.save(newSession);
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async getAllUnclaimedBySession(sessionId:number) {
        try {
            const dataSource: DataSource = await this.dataSourceConfig;
            const treasureRepository: Repository<TreasuresDto> =
                dataSource.getRepository(TreasuresDto);
            return await treasureRepository.find({
                select:{
                    id:true,
                    img:true,
                    posX:true,
                    posY:true,
                    value:true
                },
                where:{
                    isClaim:false,
                    session:{
                        id: sessionId
                    }
                }})
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async getById(id:number) {
        try {
            const dataSource: DataSource = await this.dataSourceConfig;
            const treasureRepository: Repository<TreasuresDto> =
                dataSource.getRepository(TreasuresDto);
            return await treasureRepository.findOne({
                where:{
                    id:id
                }})
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async updateClaim(treasure : TreasuresModelUpdate) {
        try {
            const dataSource: DataSource = await this.dataSourceConfig;
            const treasureRepository: Repository<TreasuresDto> = dataSource.getRepository(TreasuresDto);
            return await treasureRepository.update({id:treasure.id}, {
                isClaim: treasure.isClaim
            })
        } catch (error: any) {
            throw new Error(error)
        }
    }
}
