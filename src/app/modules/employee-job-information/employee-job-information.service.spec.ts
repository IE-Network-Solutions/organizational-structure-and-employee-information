import { employeeInformationDataSave } from './../employee-information/tests/employee-information.data';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';

import { PaginationService } from '../../../core/pagination/pagination.service';
import { EmployeeJobInformationService } from './employee-job-information.service';
import { EmployeeJobInformation } from './entities/employee-job-information.entity';
import {
  employeeJobInformationDataSave,
  deleteEmployeeJobInformationData,
  paginationResultEmployeeJobInformationData,
} from './tests/employee-job-information.data';
import { NotFoundException } from '@nestjs/common';
import { employeeInformationData } from '../employee-information/tests/employee-information.data';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';

describe('EmployeeJobInformationService', () => {
  let employeeJobInformationService: EmployeeJobInformationService;
  let employeeJobInformationRepository: MockProxy<
    Repository<EmployeeJobInformation>
  >;
  let paginationService: MockProxy<PaginationService>;
  const employeeJobInformationToken = getRepositoryToken(
    EmployeeJobInformation,
  );

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EmployeeJobInformationService,
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
        {
          provide: employeeJobInformationToken,
          useValue: mock<Repository<EmployeeJobInformation>>(),
        },
      ],
    }).compile();

    employeeJobInformationService =
      moduleRef.get<EmployeeJobInformationService>(
        EmployeeJobInformationService,
      );
    employeeJobInformationRepository = moduleRef.get(
      employeeJobInformationToken,
    );
    paginationService = moduleRef.get(PaginationService);
  });

  describe('create', () => {
    describe('when create is called', () => {
      beforeEach(() => {
        employeeJobInformationRepository.create.mockReturnValue(
          employeeJobInformationDataSave() as any,
        );
        employeeJobInformationRepository.save.mockResolvedValue(
          employeeJobInformationDataSave() as any,
        );
      });

      it('should call employeeJobInformationRepository.create', async () => {
        await employeeJobInformationService.create(
          employeeJobInformationDataSave() as any,
          'tenant-id',
        );
        expect(employeeJobInformationRepository.create).toHaveBeenCalledWith({
          ...employeeJobInformationDataSave(),
          tenantId: 'tenant-id',
        });
      });

      it('should return the created employee job information', async () => {
        const result = await employeeJobInformationService.create(
          employeeJobInformationDataSave() as any,
          'tenant-id',
        );
        expect(result).toEqual(employeeJobInformationDataSave());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      beforeEach(() => {
        paginationService.paginate.mockResolvedValue(
          paginationResultEmployeeJobInformationData(),
        );
      });

      it('should return paginated employee job information', async () => {
        const result = await employeeJobInformationService.findAll(
          paginationOptions(),
        );
        expect(result).toEqual(paginationResultEmployeeJobInformationData());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      beforeEach(() => {
        employeeJobInformationRepository.createQueryBuilder.mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(employeeJobInformationDataSave()),
        } as any);
      });

      it('should call employeeJobInformationRepository.createQueryBuilder', async () => {
        await employeeJobInformationService.findOne('id');
        expect(
          employeeJobInformationRepository.createQueryBuilder,
        ).toHaveBeenCalledWith('employee-job-information');
      });

      it('should return the employee job information', async () => {
        const result = await employeeJobInformationService.findOne('id');
        expect(result).toEqual(employeeJobInformationDataSave());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      beforeEach(async () => {
        employeeJobInformationRepository.findOneOrFail.mockResolvedValue(
          employeeJobInformationDataSave() as any,
        );
        employeeJobInformationRepository.update.mockResolvedValue({
          raw: [],
          generatedMaps: [],
          affected: 1,
        });
        employeeJobInformationRepository.findOneOrFail.mockResolvedValue(
          employeeJobInformationDataSave() as any,
        );
      });

      it('should call employeeJobInformationRepository.findOneOrFail initially', async () => {
        await employeeJobInformationService.update(
          'id',
          employeeJobInformationDataSave() as any,
        );
        expect(
          employeeJobInformationRepository.findOneOrFail,
        ).toHaveBeenCalledWith({
          where: { id: 'id' },
        });
      });

      it('should call employeeJobInformationRepository.findOneOrFail again to return the updated entity', async () => {
        await employeeJobInformationService.update(
          'id',
          employeeJobInformationDataSave() as any,
        );
        expect(
          employeeJobInformationRepository.findOneOrFail,
        ).toHaveBeenCalledTimes(2);
        expect(
          employeeJobInformationRepository.findOneOrFail,
        ).toHaveBeenCalledWith({
          where: { id: 'id' },
        });
      });

      it('should return the updated employee job information', async () => {
        const result = await employeeJobInformationService.update(
          'id',
          employeeJobInformationDataSave() as any,
        );
        expect(result).toEqual(employeeJobInformationDataSave());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(() => {
        employeeJobInformationRepository.findOneOrFail.mockResolvedValue(
          employeeJobInformationDataSave() as any,
        );
        employeeJobInformationRepository.softDelete.mockResolvedValue(
          deleteEmployeeJobInformationData(),
        );
      });

      it('should call employeeJobInformationRepository.findOneOrFail', async () => {
        await employeeJobInformationService.remove('id');
        expect(
          employeeJobInformationRepository.findOneOrFail,
        ).toHaveBeenCalledWith({
          where: { id: 'id' },
        });
      });

      it('should call employeeJobInformationRepository.softDelete', async () => {
        await employeeJobInformationService.remove('id');
        expect(
          employeeJobInformationRepository.softDelete,
        ).toHaveBeenCalledWith({ id: 'id' });
      });

      it('should return void when the employee job information is removed', async () => {
        const result = await employeeJobInformationService.remove('id');
        expect(result).toEqual(deleteEmployeeJobInformationData());
      });
    });
  });
});
