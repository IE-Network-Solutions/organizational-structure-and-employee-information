import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';

import { PaginationService } from '@root/src/core/pagination/pagination.service';

import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { EmployeeTerminationService } from './employee-termination.service';
import { EmployeeTermination } from './entities/employee-termination.entity';
import { CreateEmployeeTerminationDto } from './dto/create-employee-termination.dto';
import {
  deleteEmployeeTerminationData,
  employeeTerminationData,
  paginationResultEmployeeTerminationData,
} from './tests/employee-termination.data';
import { UserService } from '../users/services/user.service';
import { promises } from 'fs';
import { NotFoundException } from '@nestjs/common';
import { EmployeeJobInformationService } from '../employee-job-information/employee-job-information.service';
import { EmployeeInformationService } from '../employee-information/employee-information.service';

describe('EmployeeTerminationService', () => {
  let employeeTerminationService: EmployeeTerminationService;
  let userService: UserService;
  let employeeTerminationRepository: MockProxy<Repository<EmployeeTermination>>;
  let paginationService: MockProxy<PaginationService>;
  let employeeJobInformationService: MockProxy<EmployeeJobInformationService>;
  let employeeIformationService: MockProxy<EmployeeInformationService>;

  const employeeTerminationToken = getRepositoryToken(EmployeeTermination);
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EmployeeTerminationService,
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
        {
          provide: EmployeeJobInformationService,
          useValue: mock<EmployeeJobInformationService>(),
        },
        {
          provide: EmployeeInformationService,
          useValue: mock<EmployeeInformationService>(),
        },
        {
          provide: UserService,
          useValue: mock<UserService>(),
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
            }),
          },
        },
        {
          provide: employeeTerminationToken,
          useValue: mock<Repository<EmployeeTermination>>(),
        },
      ],
    }).compile();

    employeeTerminationService = moduleRef.get<EmployeeTerminationService>(
      EmployeeTerminationService,
    );
    userService = moduleRef.get<UserService>(UserService);
    userService = moduleRef.get<UserService>(UserService);
    employeeTerminationRepository = moduleRef.get(employeeTerminationToken);
    paginationService = moduleRef.get(PaginationService);
  });

  describe('create', () => {
    describe('when create is called', () => {
      let employeeTermination: EmployeeTermination;
      let createEmployeeTerminationDto: CreateEmployeeTerminationDto;

      beforeEach(async () => {
        createEmployeeTerminationDto = employeeTerminationData();

        employeeTerminationRepository.create.mockReturnValue(
          employeeTerminationData() as any,
        );
        employeeTerminationRepository.save.mockResolvedValue(
          employeeTerminationData() as any,
        );
      });

      it('should call roleRepository.create', async () => {
        await employeeTerminationService.create(
          employeeTerminationData(),
          employeeTerminationData().tenantId,
        );
        expect(employeeTerminationRepository.create).toHaveBeenCalledWith({
          tenantId: employeeTerminationData().tenantId,
          ...createEmployeeTerminationDto,
        });
      });

      it('should call roleRepository.save', async () => {
        await employeeTerminationService.create(
          createEmployeeTerminationDto,
          employeeTerminationData().tenantId,
        );
        expect(employeeTerminationRepository.save).toHaveBeenCalledWith(
          employeeTerminationData(),
        );
      });

      it('should return the created role', async () => {
        employeeTermination = await employeeTerminationService.create(
          createEmployeeTerminationDto,
          employeeTerminationData().tenantId,
        );
        expect(employeeTermination).toEqual(employeeTerminationData());
      });
    });
  });
  describe('findOne', () => {
    describe('when findOne is called', () => {
      let employeeData: CreateEmployeeTerminationDto; // Declare the variable here

      beforeEach(async () => {
        employeeData = await employeeTerminationService.findOne(
          employeeTerminationData().id,
        );
        employeeTerminationRepository.findOne.mockResolvedValue(
          employeeTerminationData().id as any,
        );
      });

      it('should call roleRepository.findOne', async () => {
        await employeeTerminationService.findOne(employeeTerminationData().id);
        expect(
          employeeTerminationRepository.findOneOrFail,
        ).toHaveBeenCalledWith({
          where: { id: employeeTerminationData().id },
        });
      });
    });
  });

  describe('findOneByUserIdWithJobInfo', () => {
    describe('when findOneByUserIdWithJobInfo is called', () => {
      let employeeData: CreateEmployeeTerminationDto;

      beforeEach(async () => {
        employeeData =
          await employeeTerminationService.findOneByUserIdWithJobInfo(
            employeeTerminationData().userId,
          );
        employeeTerminationRepository.findOne.mockResolvedValue(
          employeeTerminationData(),
        );
      });

      it('should call employeeTerminationRepository.findOne', async () => {
        await employeeTerminationService.findOneByUserIdWithJobInfo(
          employeeTerminationData().userId,
        );
        expect(employeeTerminationRepository.findOne).toHaveBeenCalledWith({
          where: { userId: employeeTerminationData().userId, isActive: true },
          relations: ['jobInformation'],
        });
      });

      it('should return the correct termination data', async () => {
        const result =
          await employeeTerminationService.findOneByUserIdWithJobInfo(
            employeeTerminationData().userId,
          );
        expect(result).toEqual(employeeTerminationData());
      });

      // it('should throw NotFoundException if termination is not found', async () => {
      //   employeeTerminationRepository.findOne.mockResolvedValue(null);
      //   await expect(employeeTerminationService.findOneByUserIdWithJobInfo(employeeTerminationData().userId)).rejects.toThrowError(NotFoundException);
      // });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      beforeEach(async () => {
        paginationService.paginate.mockResolvedValue(
          paginationResultEmployeeTerminationData(),
        );
      });

      it('should call paginationService.paginate with correct parameters', async () => {
        await employeeTerminationService.findAll(
          employeeTerminationData().tenantId,
          paginationOptions(),
        );
      });

      it('should return paginated roles', async () => {
        const employeeTermination = await employeeTerminationService.findAll(
          employeeTerminationData().tenantId,
          paginationOptions(),
        );
        expect(employeeTermination).toEqual(
          paginationResultEmployeeTerminationData(),
        );
      });
    });
  });

  describe('update', () => {
    describe('when update employee termination is called', () => {
      let employeeTermination: EmployeeTermination;
      beforeEach(async () => {
        jest
          .spyOn(employeeTerminationService, 'findOne')
          .mockResolvedValue(employeeTerminationData());
        employeeTerminationRepository.update.mockResolvedValue(
          deleteEmployeeTerminationData(),
        );
      });

      it('should call employeeTerminationService.findOne', async () => {
        await employeeTerminationService.update(
          employeeTerminationData().id,
          employeeTerminationData(),
        );
        expect(employeeTerminationService.findOne).toHaveBeenCalledWith(
          employeeTerminationData().id,
        );
      });

      it('should call employeeTerminationService.update', async () => {
        await employeeTerminationService.update(
          employeeTerminationData().id,
          employeeTerminationData(),
        );
        expect(employeeTerminationRepository.update).toHaveBeenCalledWith(
          employeeTerminationData().id,
          employeeTerminationData(),
        );
      });

      it('should return the updated employee Termination', async () => {
        employeeTermination = await employeeTerminationService.update(
          employeeTerminationData().id,
          employeeTerminationData(),
        );
        expect(employeeTermination).toEqual(employeeTerminationData());
      });
    });
  });

  describe('remove', () => {
    describe('when removeClient is called', () => {
      beforeEach(async () => {
        jest
          .spyOn(employeeTerminationService, 'findOne')
          .mockResolvedValue(employeeTerminationData());
        employeeTerminationRepository.softRemove.mockResolvedValue(
          employeeTerminationData(),
        );
      });

      it('should call employeeTerminationRepository.delete', async () => {
        await employeeTerminationService.remove(employeeTerminationData().id);
        expect(employeeTerminationRepository.softRemove).toHaveBeenCalledWith({
          id: employeeTerminationData().id,
        });
      });

      it('should return void when the client is removed', async () => {
        const result = await employeeTerminationService.remove(
          employeeTerminationData().id,
        );
        expect(result).toEqual(employeeTerminationData());
      });
    });
  });
});
