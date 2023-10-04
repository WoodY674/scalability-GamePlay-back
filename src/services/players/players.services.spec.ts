import {DataSource, Repository, SelectQueryBuilder, createConnection, Connection} from 'typeorm';
import {PlayersService} from './players.services';
import {PlayersDto} from '../../dto/players';
import {PlayersModelRequest, PlayersModelUpdate} from '../../models/players';
import {mock} from 'jest-mock-extended';
import {SessionDto} from "../../dto/sessions";

const repositoryMock = mock<Repository<any>>();
const qbuilderMock = mock<SelectQueryBuilder<any>>();

jest.mock('typeorm', () => {
    return {
        DataSource: class MockDataSource {
            initialize = jest.fn().mockResolvedValue(this);
            getRepository = jest.fn().mockReturnValue(repositoryMock);
        },
        getRepository: () => repositoryMock,
        BaseEntity: class Mock {
        },
        ObjectType: () => {
        },
        Entity: () => {
        },
        InputType: () => {
        },
        Index: () => {
        },
        PrimaryGeneratedColumn: () => {
        },
        Column: () => {
        },
        CreateDateColumn: () => {
        },
        UpdateDateColumn: () => {
        },
        OneToMany: () => {
        },
        ManyToOne: () => {
        },
        JoinColumn: () => {
        },
    }
});

// Maintenant, vous pouvez initialiser qbuilderMock avec mockReturnThis
qbuilderMock.where.mockReturnThis();
qbuilderMock.select.mockReturnThis();
repositoryMock.createQueryBuilder.mockReturnValue(qbuilderMock);

describe('PlayerService', () => {
    let playersService: PlayersService;
    let playerModelRequest: PlayersModelRequest;
    let playerModelUpdate: PlayersModelUpdate;
    let connection: DataSource;

    beforeAll(async () => {
        // Initialisez la base de données de test une fois

        connection = new DataSource({
            type: 'sqlite',
            database: 'test-unitaires/testing.db',
            synchronize: true,
            logging: false,
            entities: [
                PlayersDto,
                SessionDto
            ]
        });
        playersService = new PlayersService(connection.initialize());
        playerModelRequest = {
            userid: 1,
            session: {
                id: 1,
                backgroundImg: 'backgroundImg',
                width: 1,
                height: 1
            },
            avatar: 'avatar.png',
            posX: 1,
            posY: 1
        }
        playerModelUpdate  = {
            id:1,
            posX: 1,
            posY: 1
        }
    });

    beforeEach(async () => {
    });

    afterEach(async () => {
        // Annulez la transaction après chaque test (facultatif)
        jest.clearAllMocks()
    });

    describe('createPlayers', () => {

        it('should try catch content', async () => {
            const playerRepository: Repository<PlayersDto> = connection.getRepository(PlayersDto);
            const spy = jest.spyOn(playerRepository, 'create').mockImplementation(() => {
                throw new Error('Error');
            });
            try {
                await playersService.create(playerModelRequest);
                // If the create method does not throw an error, fail the test
                fail('Expected an error to be thrown');
            } catch (error:any) {
                expect(error.message).toBe('Error: Error');
            }
        });
        it('should create a new player', async () => {
            // Mock the dependencies
            const playerRepository: Repository<PlayersDto> =
                connection.getRepository(PlayersDto);
            // Create a valid PlayersModelRequest object
            const playerDto:PlayersDto = {
                id: 1,
                userid: playerModelRequest.userid,
                session: playerModelRequest.session,
                avatar: playerModelRequest.avatar,
                posX: playerModelRequest.posX,
                posY: playerModelRequest.posY
            }

            // Mock the create and save methods
            const createSpy = jest.spyOn(playerRepository, 'create').mockReturnValue(playerDto);
            const saveSpy = jest.spyOn(playerRepository, 'save').mockResolvedValue(playerDto);

            // Call the create method
            const result = await playersService.create(playerModelRequest);

            // Assert that the getRepository and save methods are called with the expected arguments
            expect(connection.getRepository).toHaveBeenCalledWith(PlayersDto);
            expect(createSpy).toHaveBeenCalledWith({
                userid: playerModelRequest.userid,
                session: playerModelRequest.session,
                avatar: playerModelRequest.avatar,
                posX: playerModelRequest.posX,
                posY: playerModelRequest.posY
            });
            expect(saveSpy).toHaveBeenCalled();

            // Assert that the create method returns the expected value
            expect(result).toEqual(playerDto);
        });
    });

    describe('updatePos', () => {
        it('should try catch content', async () => {
            const playerRepository: Repository<PlayersDto> = connection.getRepository(PlayersDto);
            const spy = jest.spyOn(playerRepository, 'save').mockImplementation(() => {
                throw new Error('Error');
            });
            try {
                await playersService.updatePos(playerModelUpdate);
                fail('Expected an error to be thrown');
            } catch (error:any) {
                expect(error.message).toBe('Error: Error');
            }
        });
        it('should update a position and return the updated player', async () => {
            const playerRepository: Repository<PlayersDto> = connection.getRepository(PlayersDto);
            const playerModelUpdate = {
                id: 1,
                posX: 10,
                posY: 20
            };
            const updatedPlayer : PlayersModelUpdate = {
                id: playerModelUpdate.id,
                posX: playerModelUpdate.posX,
                posY: playerModelUpdate.posY
            };
            jest.spyOn(playerRepository, 'save').mockResolvedValue(updatedPlayer as PlayersDto);

            const result = await playersService.updatePos(playerModelUpdate);

            expect(result).toEqual(updatedPlayer);
        });
    });

});
