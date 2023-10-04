import {DataSource, DeleteResult, Repository, SelectQueryBuilder} from 'typeorm';
import {SessionDto} from '../../dto/sessions';
import {mock} from 'jest-mock-extended';
import {SessionsServices} from "./sessions.services";
import {SessionModelRequest} from "../../models/sessions";

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

describe('SessionService', () => {
    let sessionsService: SessionsServices;
    let sessionModelRequest: SessionModelRequest;
    let session: SessionDto
    let connection: DataSource;
    let arraySessions : SessionDto[]
    let deleteResultTest : DeleteResult

    beforeAll(async () => {
        // Initialisez la base de données de test une fois

        connection = new DataSource({
            type: 'sqlite',
            database: 'test-unitaires/testing.db',
            synchronize: true,
            logging: false,
            entities: [
                SessionDto,
            ]
        });
        sessionsService = new SessionsServices(connection.initialize());
        sessionModelRequest = {
            backgroundImg: 'back.png',
            width:200,
            height:200
        }
        arraySessions = [
            {
                id: 1,
                backgroundImg: 'back.png',
                width:200,
                height:200
            },
            {
                id: 2,
                backgroundImg: 'back.png',
                width:200,
                height:200
            }
        ]
    });

    beforeEach(async () => {
    });

    afterEach(async () => {
        // Annulez la transaction après chaque test (facultatif)
        jest.clearAllMocks()
    });

    describe('createSessions', () => {

        it('should try catch content', async () => {
            const sessionsRepository: Repository<SessionDto> =
                connection.getRepository(SessionDto);
            const spy =
                jest.spyOn(sessionsRepository, 'create')
                    .mockImplementation(() => {
                        throw new Error('Error');
                    });
            try {
                await sessionsService.create(sessionModelRequest);
                // If the create method does not throw an error, fail the test
                fail('Expected an error to be thrown');
            } catch (error: any) {
                expect(error.message).toBe('Error: Error');
            }
        });
        it('should create a new treasure', async () => {
            // Mock the dependencies
            const sessionsRepository: Repository<SessionDto> =
                connection.getRepository(SessionDto);
            // Create a valid SessionsModelRequest object
            const sessionDto: SessionDto = {
                id: 2,
                backgroundImg : 'back.png',
                width:200,
                height:200
            }

            // Mock the create and save methods
            const createSpy = jest.spyOn(sessionsRepository, 'create').mockReturnValue(sessionDto);
            const saveSpy = jest.spyOn(sessionsRepository, 'save').mockResolvedValue(sessionDto);

            // Call the create method
            const result = await sessionsService.create(sessionModelRequest);

            // Assert that the getRepository and save methods are called with the expected arguments
            expect(connection.getRepository).toHaveBeenCalledWith(SessionDto);
            expect(createSpy).toHaveBeenCalledWith({
                backgroundImg : 'back.png',
                width:200,
                height:200
            });
            expect(saveSpy).toHaveBeenCalled();
            // Assert that the create method returns the expected value
            expect(result).toEqual(sessionDto);
        });
    });

    describe('delete', () => {
        it('should try catch content', async () => {
            const sessionsRepository: Repository<SessionDto> = connection.getRepository(SessionDto);
            const spy = jest.spyOn(sessionsRepository, 'delete').mockImplementation(() => {
                throw new Error('Error');
            });
            try {
                await sessionsService.delete(0);
                fail('Expected an error to be thrown');
            } catch (error: any) {
                expect(error.message).toBe('Error: Error');
            }
        });
        it('should update a position and return the updated treasure', async () => {
            const sessionsRepository: Repository<SessionDto> = connection.getRepository(SessionDto);

            const maPromesse :Promise<DeleteResult> = new Promise((resolve, reject) => {
                setTimeout(() => {
                    return resolve({raw:'default',affected:1});
                }, 1000);
            });
            const deleteSpy = jest.spyOn(sessionsRepository, 'delete').mockReturnValue(maPromesse);

            // Call the delete method and assert the return value
            const res = await sessionsService.delete(1);
            expect(deleteSpy).toHaveBeenCalled();
            // Assert that the create method returns the expected value
            expect(res).toEqual({raw:'default',affected:1});
        });
    });

    describe('getAllUnclaimedBySession', () => {
        it('should try catch content', async () => {
            const sessionsRepository: Repository<SessionDto> = connection.getRepository(SessionDto);
            const spy = jest
                .spyOn(sessionsRepository, 'find').mockImplementation(() => {
                    throw new Error('Error');
                });
            try {
                await sessionsService.getAll();
                fail('Expected an error to be thrown');
            } catch (error: any) {
                expect(error.message).toBe('Error: Error');
            }
        });
        it('should return all treasure isClaim', async () => {
            const sessionsRepository: Repository<SessionDto> = connection.getRepository(SessionDto);
            const maPromesse :Promise<SessionDto[]> = new Promise((resolve, reject) => {
                setTimeout(() => {
                    return resolve(arraySessions);
                }, 1000);
            });
            // Configurez le mock pour retourner les trésors non réclamés
            const findSpy = jest.spyOn(sessionsRepository, 'find')
                .mockResolvedValue(maPromesse);
            // Appelez la méthode à tester
            const result = await sessionsService.getAll();

            // Vérifiez si la méthode find du mock Repository a été appelée avec les bons arguments
            expect(findSpy).toHaveBeenCalledWith();
            expect(result).toEqual(arraySessions);
        });
    });

});
