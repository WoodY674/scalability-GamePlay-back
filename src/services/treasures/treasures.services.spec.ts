import {DataSource, Repository, SelectQueryBuilder} from 'typeorm';
import {TreasuresDto} from '../../dto/treasures';
import {TreasuresModelRequest, TreasuresModelUpdate} from '../../models/treasures';
import {mock} from 'jest-mock-extended';
import {SessionDto} from "../../dto/sessions";
import {TreasuresServices} from "./treasures.services";
import {SessionsServices} from "../sessions/sessions.services";

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

describe('TreasureService', () => {
    let treasuresService: TreasuresServices;
    let treasureModelRequest: TreasuresModelRequest;
    let treasureModelUpdate: TreasuresModelUpdate;
    let session: SessionDto
    let connection: DataSource;
    let arrayTreasures : TreasuresDto[]

    beforeAll(async () => {
        // Initialisez la base de données de test une fois

        connection = new DataSource({
            type: 'sqlite',
            database: 'test-unitaires/testing.db',
            synchronize: true,
            logging: false,
            entities: [
                TreasuresDto,
                SessionDto
            ]
        });
        treasuresService = new TreasuresServices(connection.initialize());
        treasureModelRequest = {
            session: {
                id: 1,
                backgroundImg: 'backgroundImg',
                width: 1,
                height: 1
            },
            img: 'img.png',
            posX: 1,
            posY: 1,
            value: 5
        }
        treasureModelUpdate = {
            id: 1,
            isClaim: false
        }
        session = {
            id: 1,
            backgroundImg: 'backgroundImg',
            width: 1,
            height: 1
        }
        arrayTreasures = [
            {
                id: 1,
                img: 'img1.png',
                posX: 1,
                posY: 1,
                value: 5,
                isClaim: false,
                session: {
                    id: 1,
                    backgroundImg: 'backgroundImg',
                    width: 1,
                    height: 1
                }
            },
            {
                id: 2,
                img: 'img2.png',
                posX: 2,
                posY: 2,
                value: 10,
                isClaim: false,
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

    describe('createTreasures', () => {

        it('should try catch content', async () => {
            const treasureRepository: Repository<TreasuresDto> =
                connection.getRepository(TreasuresDto);
            const spy =
                jest.spyOn(treasureRepository, 'create')
                    .mockImplementation(() => {
                        throw new Error('Error');
                    });
            try {
                await treasuresService.create(treasureModelRequest);
                // If the create method does not throw an error, fail the test
                fail('Expected an error to be thrown');
            } catch (error: any) {
                expect(error.message).toBe('Error: Error');
            }
        });
        it('should create a new treasure', async () => {
            // Mock the dependencies
            const treasureRepository: Repository<TreasuresDto> =
                connection.getRepository(TreasuresDto);
            // Create a valid TreasuresModelRequest object
            const treasureDto: TreasuresDto = {
                id: 2,
                session: treasureModelRequest.session,
                posX: treasureModelRequest.posX,
                posY: treasureModelRequest.posY,
                isClaim: false,
                img: treasureModelRequest.img,
                value: treasureModelRequest.value
            }

            // Mock the create and save methods
            const createSpy = jest.spyOn(treasureRepository, 'create').mockReturnValue(treasureDto);
            const saveSpy = jest.spyOn(treasureRepository, 'save').mockResolvedValue(treasureDto);

            // Call the create method
            const result = await treasuresService.create(treasureModelRequest);

            // Assert that the getRepository and save methods are called with the expected arguments
            expect(connection.getRepository).toHaveBeenCalledWith(TreasuresDto);
            expect(createSpy).toHaveBeenCalledWith({
                img: "img.png",
                isClaim: false,
                posX: 1,
                posY: 1,
                session: {
                    backgroundImg: "backgroundImg",
                    height: 1,
                    id: 1,
                    width: 1
                },
                value: 5
            });
            expect(saveSpy).toHaveBeenCalled();
            // Assert that the create method returns the expected value
            expect(result).toEqual(treasureDto);
        });
    });

    describe('updateClaim', () => {
        it('should try catch content', async () => {
            const treasureRepository: Repository<TreasuresDto> = connection.getRepository(TreasuresDto);
            const spy = jest.spyOn(treasureRepository, 'save').mockImplementation(() => {
                throw new Error('Error');
            });
            try {
                await treasuresService.updateClaim(treasureModelUpdate);
                fail('Expected an error to be thrown');
            } catch (error: any) {
                expect(error.message).toBe('Error: Error');
            }
        });
        it('should update a position and return the updated treasure', async () => {
            const treasureRepository: Repository<TreasuresDto> = connection.getRepository(TreasuresDto);
            const treasureModelUpdate = {
                id: 1,
                isClaim: false
            };
            const updatedTreasure: TreasuresModelUpdate = {
                id: treasureModelUpdate.id,
                isClaim: true
            };
            jest.spyOn(treasureRepository, 'save').mockResolvedValue(updatedTreasure as TreasuresDto);

            const result = await treasuresService.updateClaim(treasureModelUpdate);

            expect(result).toEqual(updatedTreasure);
        });
    });

    describe('getAllUnclaimedBySession', () => {
        it('should try catch content', async () => {
            const treasureRepository: Repository<TreasuresDto> = connection.getRepository(TreasuresDto);
            const spy = jest
                .spyOn(treasureRepository, 'find').mockImplementation(() => {
                    throw new Error('Error');
                });
            try {
                await treasuresService.getAllUnclaimedBySession(session);
                fail('Expected an error to be thrown');
            } catch (error: any) {
                expect(error.message).toBe('Error: Error');
            }
        });
        it('should return all treasure isClaim', async () => {
            const treasureRepository: Repository<TreasuresDto> = connection.getRepository(TreasuresDto);
            const maPromesse :Promise<TreasuresDto[]> = new Promise((resolve, reject) => {
                setTimeout(() => {
                    return resolve(arrayTreasures);
                }, 1000);
            });
            // Configurez le mock pour retourner les trésors non réclamés
            const findSpy = jest.spyOn(treasureRepository, 'find').mockResolvedValue(maPromesse);
            // Appelez la méthode à tester
            const result = await treasuresService.getAllUnclaimedBySession(session);

            // Vérifiez si la méthode find du mock Repository a été appelée avec les bons arguments
            expect(findSpy).toHaveBeenCalledWith({
                select: {
                    id: true,
                    img: true,
                    posX: true,
                    posY: true,
                    value: true,
                },
                where: {
                    isClaim: false,
                    session: session,
                },
            });
            expect(result).toEqual(arrayTreasures);
        });
    });

});
