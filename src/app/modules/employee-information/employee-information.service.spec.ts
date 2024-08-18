import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeInformationService } from './employee-information.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployeeInformation } from './entities/employee-information.entity';
import { Repository } from 'typeorm';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { applySearchFilterUtils } from '@root/src/core/utils/search-filter.utils';
import { mock, MockProxy } from 'jest-mock-extended';
import {
  createEmployeeInformationData,
  employeeInformationData,
  paginationResultEmployeeInformationData,
  deleteEmployeeInformationData,
} from './tests/employee-information.data';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import { Pagination } from 'nestjs-typeorm-paginate';

describe('EmployeeInformationService', () => {
  let employeeInformationService: EmployeeInformationService;
  let repository: MockProxy<Repository<EmployeeInformation>>;
  let paginationService: MockProxy<PaginationService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeInformationService,
        {
          provide: getRepositoryToken(EmployeeInformation),
          useValue: mock<Repository<EmployeeInformation>>(),
        },
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
      ],
    }).compile();

    employeeInformationService = module.get<EmployeeInformationService>(
      EmployeeInformationService,
    );
    repository = module.get(getRepositoryToken(EmployeeInformation));
    paginationService = module.get(PaginationService);
  });

  describe('create', () => {
    it('should create and save a new employee information', async () => {
      const tenantId = 'tenant-id';
      const createDto = createEmployeeInformationData();

      repository.create.mockReturnValue({
        ...createDto,
        tenantId,
      } as EmployeeInformation);
      repository.save.mockResolvedValue(employeeInformationData());

      const result = await employeeInformationService.create(
        createDto,
        tenantId,
      );

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        tenantId,
      });
      expect(repository.save).toHaveBeenCalledWith({ ...createDto, tenantId });
      expect(result).toEqual(employeeInformationData());
    });

    it('should throw ConflictException when save fails', async () => {
      const tenantId = 'tenant-id';
      const createDto = createEmployeeInformationData();

      repository.create.mockReturnValue({
        ...createDto,
        tenantId,
      } as EmployeeInformation);
      repository.save.mockRejectedValue(new Error('Save error'));

      await expect(
        employeeInformationService.create(createDto, tenantId),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated employee information', async () => {
      const paginationOptions: PaginationDto = { page: 1, limit: 10 };
      const searchFilterDTO: SearchFilterDTO = {};
      const tenantId = 'tenant-id';

      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([employeeInformationData()]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);
      paginationService.paginate.mockResolvedValue(
        paginationResultEmployeeInformationData(),
      );

      const result = await employeeInformationService.findAll(
        paginationOptions,
        searchFilterDTO,
        tenantId,
      );

      expect(repository.createQueryBuilder).toHaveBeenCalledWith(
        'employeeInformation',
      );
      expect(paginationService.paginate).toHaveBeenCalledWith(
        repository,
        'employeeInformation',
        { page: paginationOptions.page, limit: paginationOptions.limit },
        paginationOptions.orderBy,
        paginationOptions.orderDirection,
        { tenantId },
      );
      expect(result).toEqual(paginationResultEmployeeInformationData());
    });
  });

  describe('findOne', () => {
    it('should return employee information by ID', async () => {
      const id = 'employee-id';

      repository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(employeeInformationData()),
      } as any);

      const result = await employeeInformationService.findOne(id);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith(
        'employee_information',
      );
      expect(result).toEqual(employeeInformationData());
    });
  });

  describe('update', () => {
    it('should update and return employee information', async () => {
      const id = 'employee-id';
      const updateDto = createEmployeeInformationData();

      repository.findOneOrFail.mockResolvedValue(
        employeeInformationData() as any,
      );
      repository.update.mockResolvedValue(undefined);
      repository.findOneOrFail.mockResolvedValue(
        employeeInformationData() as any,
      );

      const result = await employeeInformationService.update(id, updateDto);

      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { id } });
      expect(repository.update).toHaveBeenCalledWith({ id }, updateDto);
      expect(result).toEqual(employeeInformationData());
    });
  });

  describe('remove', () => {
    it('should soft delete employee information', async () => {
      const id = 'employee-id';

      repository.findOneOrFail.mockResolvedValue(
        employeeInformationData() as any,
      );
      repository.softDelete.mockResolvedValue(deleteEmployeeInformationData());

      const result = await employeeInformationService.remove(id);

      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { id } });
      expect(repository.softDelete).toHaveBeenCalledWith({ id });
      expect(result).toEqual(deleteEmployeeInformationData());
    });
  });
});
