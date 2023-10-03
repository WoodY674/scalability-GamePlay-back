import {DataSource, Repository} from "typeorm";
import {SessionDto} from "../../dto/sessions";
import {Utils} from "../../utils/utils";
import {SessionModelRequest} from "../../models/session";
import {RequestValidation} from "../../enum/enum";
import {CustomMessageRequest} from "../../utils/message/custum.message";

export class SessionsServices{
    dataSourceConfig: Promise<DataSource>

    constructor (dataSourceConfig: Promise<DataSource>) {
        this.dataSourceConfig = dataSourceConfig
    }

    async createSession(request: any, response: any) {
        try {
            const dataSource: DataSource = await this.dataSourceConfig;
            const sessionRepository: Repository<SessionDto> = dataSource.getRepository(SessionDto);
            let session: SessionModelRequest;
            session = {
                backgroundImg: '',
                scaleX: 0,
                scaleY: 0,
            }
            let valide : RequestValidation = Utils.validBodyRequest(
                request.body,
                session
            );
            switch (valide) {
                case RequestValidation.NO_BODY:
                    return response.status(400).json({message: CustomMessageRequest.noRequestBody});
                case RequestValidation.MISSING_PROPERTIES:
                    return response.status(400).json({message: CustomMessageRequest.missingProperties});
                case RequestValidation.TOO_MUCH_PROPERTIES:
                    return response.status(400).json({message: CustomMessageRequest.tooMuchProperties});
                case RequestValidation.WRONG_TYPE:
                    return response.status(400).json({message: CustomMessageRequest.wrongType});
                case RequestValidation.VALID:
                    break;
                default:
                    return response.status(500).json({message: CustomMessageRequest.internalServerError});
            }
            const newSession = sessionRepository.create(request.body);
            const keySession = await sessionRepository.save(newSession);
            return response.status(201).json(keySession);
        } catch (error) {
            return response.status(500).json({message: CustomMessageRequest.internalServerError});
        }
    }

    async deleteSession(request: any, response: any) {
        try {
            const dataSource: DataSource = await this.dataSourceConfig;
            const sessionRepository: Repository<SessionDto> = dataSource.getRepository(SessionDto);
            const id = request.params.id;
            const session = await sessionRepository.findOne(id);
            if (!session) {
                return response.status(404).json({message: CustomMessageRequest.notFound});
            }
            await sessionRepository.delete(id);
            return response.status(204).json();
        } catch (error) {
            return response.status(500).json({message: CustomMessageRequest.internalServerError});
        }
    }
}
