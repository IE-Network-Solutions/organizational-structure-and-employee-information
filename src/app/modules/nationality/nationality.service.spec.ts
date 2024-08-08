import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Nationality } from './entities/nationality.entity';
import { NationalityService } from './nationality.service';
import {
    createNationality,
    updateNationalityData,
    nationalityData,
} from './tests/nationality.data';
import { Repository } from 'typeorm';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { MockProxy, mock } from 'jest-mock-extended';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

describe('NationalityService', () => {
    let nationalityService: NationalityService;
    let nationalityRepository: MockProxy<Repository<Nationality>>;
    let paginationService: MockProxy<PaginationService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NationalityService,
                {
                    provide: PaginationService,
                    useValue: mock<PaginationService>(),
                },
                {
                    provide: getRepositoryToken(Nationality),
                    useValue: mock<Repository<Nationality>>(),
                },
            ],
        }).compile();

        nationalityService = module.get<NationalityService>(NationalityService);
        nationalityRepository = module.get(getRepositoryToken(Nationality));
        paginationService = module.get(PaginationService);
    });

    describe('create', () => {
        describe('when create is called', () => {
            let nationality: Nationality;

            beforeEach(() => {
                nationalityRepository.create.mockReturnValue(createNationality() as any);
                nationalityRepository.save.mockResolvedValue(nationalityData() as any);
            });

            it('should call nationalityRepository.create', async () => {
                await nationalityService.create(createNationality(), 'tenant-id');
                expect(nationalityRepository.create).toHaveBeenCalledWith({ ...createNationality(), tenantId: 'tenant-id' });
            });

            it('should call nationalityRepository.save', async () => {
                await nationalityService.create(createNationality(), 'tenant-id');
                expect(nationalityRepository.save).toHaveBeenCalledWith(createNationality());
            });

            it('should return the created nationality', async () => {
                nationality = await nationalityService.create(createNationality(), 'tenant-id');
                expect(nationality).toEqual(nationalityData());
            });
        });
    });

    describe('findAll', () => {
        it('should apply search filters correctly', async () => {
            const paginationOptions: IPaginationOptions = { page: 1, limit: 10 };
            const paginationDto = { page: 1, limit: 10 };
            const queryBuilderMock = {
                orderBy: jest.fn().mockReturnThis(),
            };
            const paginateMock = jest.fn().mockResolvedValue({ items: [nationalityData()], meta: paginationOptions });

            jest.spyOn(nationalityRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);
            jest.spyOn(paginationService, 'paginate').mockImplementation(paginateMock);

            await nationalityService.findAll(paginationDto);

            expect(nationalityRepository.createQueryBuilder).toHaveBeenCalledWith('nationality');
            expect(paginationService.paginate).toHaveBeenCalledWith(queryBuilderMock, paginationOptions);
        });
    });

    describe('findOne', () => {
        describe('when findOne is called', () => {
            let nationality: Nationality;

            beforeEach(async () => {
                nationalityRepository.createQueryBuilder.mockReturnValue({
                    where: jest.fn().mockReturnThis(),
                    getOne: jest.fn().mockResolvedValue(nationalityData()),
                } as any);
                nationality = await nationalityService.findOne(nationalityData().id);
            });

            it('should call nationalityRepository.createQueryBuilder with correct params', () => {
                expect(nationalityRepository.createQueryBuilder).toHaveBeenCalledWith('nationality');
                expect(nationalityRepository.createQueryBuilder().where).toHaveBeenCalledWith('nationality.id = :id', { id: nationalityData().id });
            });

            it('should return the nationality', () => {
                expect(nationality).toEqual(nationalityData());
            });
        });
    });

    describe('update', () => {
        describe('when update is called', () => {
            let nationality: Nationality;

            beforeEach(async () => {
                nationalityRepository.findOneOrFail.mockResolvedValue(nationalityData() as any);
                nationality = await nationalityService.update(nationalityData().id, updateNationalityData());
            });

            it('should call nationalityRepository.update with correct params', async () => {
                expect(nationalityRepository.update).toHaveBeenCalledWith(
                    { id: nationalityData().id },
                    updateNationalityData(),
                );
            });

            it('should return the updated nationality', () => {
                expect(nationality).toEqual(nationalityData());
            });
        });
    });

    describe('remove', () => {
        describe('when remove is called', () => {
            beforeEach(async () => {
                nationalityRepository.findOneOrFail.mockResolvedValue(nationalityData() as any);
            });

            it('should call nationalityRepository.findOneOrFail with correct params', async () => {
                await nationalityService.remove(nationalityData().id);
                expect(nationalityRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: nationalityData().id } });
            });

            it('should call nationalityRepository.softDelete with correct params', async () => {
                await nationalityService.remove(nationalityData().id);
                expect(nationalityRepository.softDelete).toHaveBeenCalledWith({ id: nationalityData().id });
            });
        });
    });
});
