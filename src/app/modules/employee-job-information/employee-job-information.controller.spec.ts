import { Test } from '@nestjs/testing';
import { EmployeeJobInformationsController } from './employee-job-information.controller';
import { EmployeeJobInformationService } from './employee-job-information.service';
import {
  paginationResultEmployeeJobInformationData,
  employeeJobInformationData,
} from './tests/employee-job-information.data';
import { EmployeeJobInformation } from './entities/employee-job-information.entity';

jest.mock('./employee-job-information.service');

describe('EmployeeJobInformationsController', () => {
  let employeeJobInformationsController: EmployeeJobInformationsController;
  let employeeJobInformationService: EmployeeJobInformationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EmployeeJobInformationsController],
      providers: [EmployeeJobInformationService],
    }).compile();

    employeeJobInformationsController = moduleRef.get<EmployeeJobInformationsController>(
      EmployeeJobInformationsController,
    );
    employeeJobInformationService = moduleRef.get<EmployeeJobInformationService>(
      EmployeeJobInformationService,
    );
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let employeeJobInformation: EmployeeJobInformation;
      const mockRequest = { tenantId: 'tenant-1' } as any;

      beforeEach(async () => {
        // Mock the service method to return the expected data
        jest
          .spyOn(employeeJobInformationService, 'create')
          .mockResolvedValue(employeeJobInformationData());

        employeeJobInformation = await employeeJobInformationsController.create(
          employeeJobInformationData(),
          mockRequest,
        );
      });

      test('then it should call EmployeeJobInformationService', () => {
        expect(employeeJobInformationService.create).toHaveBeenCalledWith(
          employeeJobInformationData(),
          mockRequest.tenantId,
        );
      });

      test('then it should return the created employee job information', () => {
        expect(employeeJobInformation).toEqual(employeeJobInformationData());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      const options = { page: 1, limit: 10 };
      let result;

      beforeEach(async () => {
        jest
          .spyOn(employeeJobInformationService, 'findAll')
          .mockResolvedValue(paginationResultEmployeeJobInformationData());
        result = await employeeJobInformationsController.findAll(options);
      });

      test('then it should call EmployeeJobInformationService', () => {
        expect(employeeJobInformationService.findAll).toHaveBeenCalledWith(
          options,
        );
      });

      test('then it should return a paginated list of EmployeeJobInformation', () => {
        expect(result).toEqual(paginationResultEmployeeJobInformationData());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let result;

      beforeEach(async () => {
        jest
          .spyOn(employeeJobInformationService, 'findOne')
          .mockResolvedValue(employeeJobInformationData());
        result = await employeeJobInformationsController.findOne(
          'a7c8a8b3-1f4a-4f91-a8d2-5f2a9a1b8d2c',
        );
      });

      test('then it should return the EmployeeJobInformation', () => {
        expect(result).toEqual(employeeJobInformationData());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let result;

      beforeEach(async () => {
        jest
          .spyOn(employeeJobInformationService, 'update')
          .mockResolvedValue(employeeJobInformationData());
        result = await employeeJobInformationsController.update(
          'a7c8a8b3-1f4a-4f91-a8d2-5f2a9a1b8d2c',
          employeeJobInformationData(),
        );
      });

      test('then it should call EmployeeJobInformationService', () => {
        expect(employeeJobInformationService.update).toHaveBeenCalledWith(
          'a7c8a8b3-1f4a-4f91-a8d2-5f2a9a1b8d2c',
          employeeJobInformationData(),
        );
      });

      test('then it should return the updated EmployeeJobInformation', () => {
        expect(result).toEqual(employeeJobInformationData());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        await employeeJobInformationsController.remove(
          employeeJobInformationData().id,
        );
      });

      test('then it should call EmployeeJobInformationService', () => {
        expect(employeeJobInformationService.remove).toHaveBeenCalledWith(
          employeeJobInformationData().id,
        );
      });

      test('then it should resolve successfully', async () => {
        expect(
          await employeeJobInformationsController.remove(
            employeeJobInformationData().id,
          ),
        ).toBeUndefined();
      });
    });
  });
});
