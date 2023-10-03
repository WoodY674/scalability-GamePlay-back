import {DataSource, Repository, SelectQueryBuilder, createConnection, Connection} from 'typeorm';
import { PlayersService } from './players.services';
import { PlayersDto } from '../../dto/players';
import { PlayersModelRequest } from '../../models/players';
import { mock } from 'jest-mock-extended';
import {SessionDto} from "../../dto/sessions";

const repositoryMock = mock<Repository<any>>();
const qbuilderMock = mock<SelectQueryBuilder<any>>();

jest.mock('typeorm', () => {
    return {
        getRepository: () => repositoryMock,
        BaseEntity: class Mock {},
        ObjectType: () => {},
        Entity: () => {},
        InputType: () => {},
        Index: () => {},
        PrimaryGeneratedColumn: () => {},
        Column: () => {},
        CreateDateColumn: () => {},
        UpdateDateColumn: () => {},
        OneToMany: () => {},
        ManyToOne: () => {},
        JoinColumn: () => {},
    }
});

// Maintenant, vous pouvez initialiser qbuilderMock avec mockReturnThis
qbuilderMock.where.mockReturnThis();
qbuilderMock.select.mockReturnThis();
repositoryMock.createQueryBuilder.mockReturnValue(qbuilderMock);

describe('PlayerService', () => {
    let dataSource: Promise<DataSource>;
    let playerRepository: Repository<PlayersDto>;
    let playersService: PlayersService;
    let playerModelRequest: PlayersModelRequest;

    beforeAll(async () => {
        // Initialisez la base de données de test une fois

        dataSource = new DataSource({
            type: 'sqlite',
            database: 'test-unitaires/testing.db',
            synchronize: true,
            logging: false,
            entities: [
                PlayersDto,
                SessionDto
            ]
        }).initialize()
    });

    beforeEach(async () => {
        // Commencez une transaction avant chaque test (facultatif)
        playersService = new PlayersService(playersService.dataSourceConfig);
    });

    afterEach(async () => {
        // Annulez la transaction après chaque test (facultatif)
        jest.clearAllMocks()
    });

    describe('createPlayers', () => {

        it('should try catch content', async () => {
            const playerRepository: Repository<PlayersDto> = (await dataSource).getRepository(PlayersDto);
            const spy = jest.spyOn(playerRepository, 'create').mockImplementation(() => {
                throw new Error('Error');
            });
            // Votre test ici...
        });
    });
});
