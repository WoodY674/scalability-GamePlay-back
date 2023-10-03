import {PlayersService} from "../players/players.services";
import {Request, Response} from "express";
import {DataSource} from "typeorm";
import {PlayersDto} from "../../dto/players";
import {TreasuresServices} from "./treasures.services";

describe('TreasureService', () => {
    let treasureService: TreasuresServices
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
        treasureService = new TreasuresServices(dataSource)

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


});
