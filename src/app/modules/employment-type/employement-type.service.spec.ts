import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { EmployementTypeService } from './employement-type.service';
import { EmployementType } from './entities/employement-type.entity';
import { employementTypeData, createEmployementTypeData, paginationResultEmploymentTypeData, deleteEmploymentTypeData } from './tests/employement-type.data';

describe('EmployementTypeService', () => {
    let employementTypeService: EmployementTypeService;
    let employementTypeRepository: MockProxy<Repository<EmployementType>>;
    let paginationService: MockProxy<PaginationService>;
    const employementTypeToken = getRepositoryToken(EmployementType);

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                EmployementTypeService,
                {
                    provide: PaginationService,
                    useValue: mock<PaginationService>(),
                },
                {
                    provide: EmployementTypeService,
                    useValue: mock<EmployementTypeService>(),
                },
                {
                    provide: employementTypeToken,
                    useValue: mock<Repository<EmployementType>>(),
                },
            ],
        }).compile();

        employementTypeService = moduleRef.get<EmployementTypeService>(
            EmployementTypeService,
        );
        employementTypeRepository = moduleRef.get(employementTypeToken);
        paginationService = moduleRef.get(PaginationService);
    });

    describe('create', () => {
        describe('when create is called', () => {
            let request: Request

            beforeEach(() => {
                employementTypeRepository.create.mockReturnValue(employementTypeData());
                employementTypeRepository.save.mockResolvedValue(employementTypeData());
            });

            it('should call employementTypeRepository.create', async () => {
                await employementTypeService.create(createEmployementTypeData(), request['tenantId']);
                expect(employementTypeRepository.create).toHaveBeenCalledWith(
                    createEmployementTypeData(), request['tenantId'],
                );
            });

            it('should call employementTypeRepository.save', async () => {
                await employementTypeService.create(createEmployementTypeData(), request['tenantId']);
                expect(employementTypeRepository.save).toHaveBeenCalledWith(
                    employementTypeData(),
                );
            });
        });
    });

    describe('findOne', () => {
        describe('when findOne is called', () => {
            let employementType: EmployementType;
            beforeEach(async () => {
                employementTypeRepository.findOneOrFail.mockResolvedValue(
                    employementTypeData() as any,
                );
                employementType = await employementTypeService.findOne(
                    employementTypeData().id,
                );
            });

            it('should call permissionGroupRepository.findOne', async () => {
                await employementTypeService.findOne(employementTypeData().id);
                expect(employementTypeRepository.findOneOrFail).toHaveBeenCalledWith({
                    where: { id: employementTypeData().id }
                });
            });

            it('should return the employementType', () => {
                expect(employementType).toEqual(employementTypeData());
            });
        });
    });

    describe('findAll', () => {
        describe('when findAll is called', () => {
            let mockQueryBuilder: any;

            beforeEach(() => {
                mockQueryBuilder = {
                    leftJoinAndSelect: jest.fn().mockReturnThis(),
                    getMany: jest.fn().mockReturnValue(paginationResultEmploymentTypeData()),
                };

                employementTypeRepository.createQueryBuilder.mockReturnValue(
                    mockQueryBuilder,
                );
            });

            it('should call paginationService.paginate with correct parameters', async () => {
                await employementTypeService.findAll(
                    paginationOptions(),
                );
            });

            it('should return paginated employementType', async () => {
                const result = await employementTypeService.findAll(
                    paginationOptions());

                expect(result).toEqual(paginationResultEmploymentTypeData());
            });
        });
    });

    describe('update', () => {
        describe('when update is called', () => {
            let employementType: EmployementType;
            let request: Request
            beforeEach(async () => {
                employementTypeRepository.findOneOrFail.mockResolvedValue(
                    employementTypeData(),
                );

                employementType = await employementTypeService.update(
                    employementTypeData().id,
                    createEmployementTypeData(),
                );
            });

            it('should call employementTypeRepository.findOne initially', async () => {
                expect(employementTypeRepository.findOneOrFail).toHaveBeenCalledWith({
                    where: { id: employementTypeData().id }
                });
            });

            it('should call employementTypeRepository.findOne again to return the update employeeType', async () => {
                await employementTypeService.update(
                    employementTypeData().id,
                    createEmployementTypeData(),
                );

                expect(employementTypeRepository.findOneOrFail).toHaveBeenCalledWith({
                    where: { id: employementTypeData().id },
                });
            });
        });
    });
    describe('remove', () => {
        describe('when remove is called', () => {
            beforeEach(async () => {
                employementTypeRepository.findOneOrFail.mockResolvedValue(
                    employementTypeData(),
                );
                employementTypeRepository.softDelete.mockResolvedValue(
                    deleteEmploymentTypeData(),
                );
            });

            it('should call employementTypeRepository.delete', async () => {
                await employementTypeService.remove(employementTypeData().id);
                expect(employementTypeRepository.softDelete).toHaveBeenCalledWith(
                    employementTypeData().id,
                );
            });
            it('should return void when the employementType is removed', async () => {
                const result = await employementTypeService.remove(
                    employementTypeData().id,
                );
                expect(result).toEqual(deleteEmploymentTypeData());
            });
        });
    });
});
