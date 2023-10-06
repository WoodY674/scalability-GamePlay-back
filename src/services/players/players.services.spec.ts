import {
    DataSource, Not,
    Repository,
    SelectQueryBuilder,
    UpdateResult
} from 'typeorm';
import {PlayersService} from './players.services';
import {PlayersDto} from '../../dto/players';
import {PlayersModelRequest, PlayersModelUpdate} from '../../models/players';
import {mock} from 'jest-mock-extended';
import {SessionDto} from "../../dto/sessions";
import {TreasuresDto} from "../../dto/treasures";

const crypto = require("crypto")
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
        Not: () => {
        }
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
    let session: SessionDto
    let arrayPlayers: PlayersDto[]

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
            userid: crypto.randomUUID(),
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
        playerModelUpdate = {
            userid: crypto.randomUUID(),
            posX: 1,
            posY: 1
        }
        session = {
            id: 1,
            backgroundImg: 'backgroundImg',
            width: 1,
            height: 1
        }
        arrayPlayers = [
            {
                id: 1,
                avatar: 'img1.png',
                userid: crypto.randomUUID(),
                posX: 1,
                posY: 1,
                session: {
                    id: 1,
                    backgroundImg: 'backgroundImg',
                    width: 1,
                    height: 1
                }
            },
            {
                id: 2,
                avatar: 'img1.png',
                userid: crypto.randomUUID(),
                posX: 1,
                posY: 1,
                session: {
                    id: 3,
                    backgroundImg: 'backgroundImg',
                    width: 1,
                    height: 1
                }
            },
            {
                id: 3,
                avatar: 'img1.png',
                userid: crypto.randomUUID(),
                posX: 10,
                posY: 10,
                session: {
                    id: 1,
                    backgroundImg: 'backgroundImg',
                    width: 1,
                    height: 1
                }
            },
        ];
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
            } catch (error: any) {
                expect(error.message).toBe('Error: Error');
            }
        });
        it('should create a new player', async () => {
            // Mock the dependencies
            const playerRepository: Repository<PlayersDto> =
                connection.getRepository(PlayersDto);
            // Create a valid PlayersModelRequest object
            const playerDto: PlayersDto = {
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
            const spy = jest.spyOn(playerRepository, 'update').mockImplementation(() => {
                throw new Error('Error');
            });
            try {
                await playersService.updatePos(playerModelUpdate);
                fail('Expected an error to be thrown');
            } catch (error: any) {
                expect(error.message).toBe('Error: Error');
            }
        });
        it('should update a position and return the updated player', async () => {
            const playerRepository: Repository<PlayersDto> = connection.getRepository(PlayersDto);
            const maPromesse: Promise<UpdateResult> = new Promise((resolve, reject) => {
                setTimeout(() => {
                    return resolve({
                        raw: 3,
                        affected: 1,
                        generatedMaps: []
                    });
                }, 1000);
            });
            const playerModelUpdate = {
                userid: crypto.randomUUID(),
                posX: 10,
                posY: 20
            };
            //commentaire
            const updatedPlayer: PlayersModelUpdate = {
                userid: playerModelUpdate.userid,
                posX: playerModelUpdate.posX,
                posY: playerModelUpdate.posY
            };
            jest.spyOn(playerRepository, 'update').mockResolvedValue(maPromesse);

            const result = await playersService.updatePos(updatedPlayer);

            expect(result).toEqual({
                raw: 3,
                affected: 1,
                generatedMaps: []
            });
        });
    });

    describe('getOtherPlayersBySession', () => {
        it('should try catch content find', async () => {
            const playerRepository: Repository<PlayersDto> = connection.getRepository(PlayersDto);
            const spy = jest.spyOn(playerRepository, 'find').mockImplementation(() => {
                throw new Error("Ceci est une erreur personnalisée.");
            });
            try {
                await playersService.updatePos(playerModelUpdate);
            } catch (error: any) {
                console.log(error)
                expect(error.message).toBe("Ceci est une erreur personnalisée.");
            }
        });
        it('should return all player', async () => {

            const playerRepository: Repository<PlayersDto> = connection.getRepository(PlayersDto);
            const maPromesse: Promise<PlayersDto[]> = new Promise((resolve, reject) => {
                setTimeout(() => {
                    return resolve([arrayPlayers[2]]);
                }, 1000);
            });
            // Configurez le mock pour retourner les trésors non réclamés
            const findSpy = jest.spyOn(playerRepository, 'find').mockResolvedValue(maPromesse);
            // Appelez la méthode à tester
            const result = await playersService.getOtherPlayersBySession(session, arrayPlayers[0].id);

            // Vérifiez si la méthode find du mock Repository a été appelée avec les bons arguments
            expect(findSpy).toHaveBeenCalledWith
            ({
                select: {
                    id: true,
                    userid: true,
                    avatar: true,
                    posX: true,
                    posY: true,
                },
                where: {
                    session: session,
                    id: Not(arrayPlayers[0].id)
                }
            });
            expect(result).toEqual([arrayPlayers[2]]);
        });
        it('should return player By Selected Null', async () => {
            const playerRepository: Repository<PlayersDto> = connection.getRepository(PlayersDto);

            // Configurez le mock pour retourner les trésors non réclamés
            const findSpy = jest.spyOn(playerRepository, 'find').mockResolvedValue([]);
            // Appelez la méthode à tester
            const result = await playersService.getOtherPlayersBySession(session, arrayPlayers[0].id);

            // Vérifiez si la méthode find du mock Repository a été appelée avec les bons arguments
            expect(findSpy).toHaveBeenCalledWith({
                select:{
                    id: true,
                    userid: true,
                    avatar: true,
                    posX: true,
                    posY: true,
                },
                where:{
                    session:session,
                    id: Not(1)
                }});
            expect(result).toEqual([]);
        });
    });

    describe('getByUid', () => {
        it('should try catch content findOne', async () => {
            const playerRepository: Repository<PlayersDto> = connection.getRepository(PlayersDto);
            const spy = jest.spyOn(playerRepository, 'findOne').mockImplementation(() => {
                throw new Error("Ceci est une erreur personnalisée.");
            });
            try {
                await playersService.updatePos(playerModelUpdate);
            } catch (error: any) {
                console.log(error)
                expect(error.message).toBe("Ceci est une erreur personnalisée.");
            }
        });
        it('should return player By Selected', async () => {
            const playerRepository: Repository<PlayersDto> = connection.getRepository(PlayersDto);
            const maPromesse: Promise<PlayersDto> = new Promise((resolve, reject) => {
                setTimeout(() => {
                    return resolve(arrayPlayers[0]);
                }, 1000);
            });
            // Configurez le mock pour retourner les trésors non réclamés
            const findSpy = jest.spyOn(playerRepository, 'findOne').mockResolvedValue(maPromesse);
            // Appelez la méthode à tester
            const result = await playersService.getByUid(arrayPlayers[0].userid);

            // Vérifiez si la méthode find du mock Repository a été appelée avec les bons arguments
            expect(findSpy).toHaveBeenCalledWith
            ({
                select:{
                    id: true,
                    userid: true,
                    avatar: true,
                    posX: true,
                    posY: true,
                },
                where:{
                    userid: arrayPlayers[0].userid
                }});
            expect(result).toEqual(arrayPlayers[0]);
        });
        it('should return player By Selected Null', async () => {
            const playerRepository: Repository<PlayersDto> = connection.getRepository(PlayersDto);

            // Configurez le mock pour retourner les trésors non réclamés
            const findSpy = jest.spyOn(playerRepository, 'findOne').mockResolvedValue(null);
            // Appelez la méthode à tester
            const result = await playersService.getByUid(arrayPlayers[0].userid);

            // Vérifiez si la méthode find du mock Repository a été appelée avec les bons arguments
            expect(findSpy).toHaveBeenCalledWith
            ({
                select:{
                    id: true,
                    userid: true,
                    avatar: true,
                    posX: true,
                    posY: true,
                },
                where:{
                    userid: arrayPlayers[0].userid
                }});
            expect(result).toEqual(null);
        });
    });

});
