import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeTerminationController } from './employee-termination.controller';
import { EmployeeTerminationService } from './employee-termination.service';
import { CreateEmployeeTerminationDto } from './dto/create-employee-termination.dto';
import { UpdateEmployeeTerminationDto } from './dto/update-employee-termination.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import {
  createEmployeeTerminationData,
  employeeTerminationData,
  paginationResultEmployeeTerminationData,
  updateEmployeeTerminationData,
} from './tests/employee-termination.data';
import { EligibleForRehire } from '@root/src/core/enum/eligible-for-hire.enum';
import { TerminationType } from '@root/src/core/enum/termination-type.dto';
jest.mock('./employee-termination.service');
describe('EmployeeTerminationController', () => {
  let controller: EmployeeTerminationController;
  let service: EmployeeTerminationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeTerminationController],
      providers: [
        {
          provide: EmployeeTerminationService,
          useValue: {
            create: jest.fn().mockResolvedValue(employeeTerminationData()),
            findAll: jest
              .fn()
              .mockResolvedValue(paginationResultEmployeeTerminationData()),
            findOne: jest.fn().mockResolvedValue(employeeTerminationData()),
            update: jest.fn().mockResolvedValue(employeeTerminationData()),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<EmployeeTerminationController>(
      EmployeeTerminationController,
    );
    service = module.get<EmployeeTerminationService>(
      EmployeeTerminationService,
    );
  });

  describe('create', () => {
    it('should create a new employee termination', async () => {
      const createDto: CreateEmployeeTerminationDto = {
        reason: 'Resignation',
        type: TerminationType.Resignation,
        eligibleForRehire: EligibleForRehire.mayBe,
        comment: 'Left for a better opportunity',
        jobInformationId: 'job-info-2',
        userId: 'user-2',
        isActive: true,
        effectiveDate: new Date('2023-02-01'),
      };
      const result = await controller.createEmployeeTermination(
        { tenantId: 'tenant-1' } as any,
        createDto,
      );
      expect(result).toEqual(employeeTerminationData());
    });
  });

  describe('findAll', () => {
    it('should return all employee terminations', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const result = await controller.findAll(
        { tenantId: 'tenant-1' } as any,
        paginationDto,
      );
      expect(result).toEqual(paginationResultEmployeeTerminationData());
    });
  });

  describe('findOne', () => {
    it('should return a single employee termination', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(employeeTerminationData());
    });
  });

  describe('update', () => {
    it('should update an employee termination', async () => {
      const updateDto: UpdateEmployeeTerminationDto = {
        reason: 'Updated reason',
        type: TerminationType.Resignation,
        eligibleForRehire: EligibleForRehire.mayBe,
        comment: 'Company downsizing',
        jobInformationId: 'job-info-3',
        userId: 'user-3',
        effectiveDate: new Date('2023-03-01'),
      };
      const result = await controller.update('1', updateDto);
      expect(result).toEqual(employeeTerminationData());
    });
  });

  describe('remove', () => {
    it('should remove an employee termination', async () => {
      const result = await controller.removeEmployeeTermination(
        employeeTerminationData().id,
      );
      expect(result).toBeUndefined();
    });
  });
});
