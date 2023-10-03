import {DataSource, Repository} from "typeorm";
import {SessionDto} from "../../dto/sessions";
import {Utils} from "../../utils/utils";
import {SessionModelRequest} from "../../models/session";
import {RequestValidation} from "../../enum/enum";

export class SessionsServices{
    dataSourceConfig: Promise<DataSource>

    constructor (dataSourceConfig: Promise<DataSource>) {
        this.dataSourceConfig = dataSourceConfig
    }

    async createPlayers(request: any, response: any) {
        try {
            const dataSource: DataSource = await this.dataSourceConfig;
            const sessionRepository: Repository<SessionDto> = dataSource.getRepository(SessionDto);
            let session: SessionModelRequest;
            session = {
                backgroundImg: '',
                scaleX: 0,
                scaleY: 0,
                isSessionOpen: true
            }
            let valide : RequestValidation = Utils.validBodyRequest(
                request.body,
                session
            );
            switch (valide) {
                case RequestValidation.NO_BODY:
                    return response.status(400).json({message: 'No body'});
                case RequestValidation.MISSING_PROPERTIES:
                    return response.status(400).json({message: 'Missing properties'});
                case RequestValidation.TOO_MUCH_PROPERTIES:
                    return response.status(400).json({message: 'Too much properties'});
                case RequestValidation.WRONG_TYPE:
                    return response.status(400).json({message: 'Wrong type'});
                case RequestValidation.VALID:
                    break;
                default:
                    return response.status(500).json({message: 'Internal server error'});
            }


            let generateKey: string = Utils.createGameKeySession();
            const keyGame = await playerRepository.save(newUser);
            return response.status(201).json(keyGame);
        } catch (error) {
            return response.status(500).json({message: });
        }
    }
}
