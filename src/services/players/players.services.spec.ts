import {request, type Request, response, type Response} from 'express'
import {DataSource, ObjectLiteral, Repository} from 'typeorm'
import {PlayersService} from './players.services'
import {PlayersDto} from '../../dto/players'

describe('PlayerService', () => {
    let sessionService: PlayersService
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>
    let dataSource: Promise<DataSource>
    let validIfThereIsNotAnExistingUserSpy: jest.SpyInstance

    beforeAll(async () => {
        // Initialisez la base de données de test une fois
        dataSource = new DataSource({
            type: 'sqlite',
            database: 'test-unitaires/testing.db',
            synchronize: true,
            logging: false,
            entities: [
                PlayersDto
            ]
        }).initialize()
    })

    beforeEach(async () => {
        // Commencez une transaction avant chaque test (facultatif)
        sessionService = new PlayersService(dataSource)

        // Initialisez mockRequest et mockResponse avant chaque test
        mockRequest = {}
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    afterEach(async () => {
        // Annulez la transaction après chaque test (facultatif)
        jest.clearAllMocks()
    })

    describe('createPlayers', () => {
        it('should try catch ', async () => {
            const dataSource: DataSource = await sessionService.dataSourceConfig
            let mockRepositoryCrash = jest.spyOn(
                dataSource, 'getRepository')
        });
    });
});
