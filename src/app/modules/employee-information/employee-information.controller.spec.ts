import { Test } from '@nestjs/testing';
import { EmployeeInformationController } from './employee-information.controller';
import { EmployeeInformationService } from './employee-information.service';
import { EmployeeInformation } from './entities/employee-information.entity';
import { UpdateEmployeeInformationDto } from './dto/update-employee-information.dto';
import {
  createEmployeeInformationData,
  employeeInformationData,
  paginationResultEmployeeInformationData,
} from './tests/employee-information.data';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { searchFilter } from '@root/src/core/commonTestData/search-filter.data';

jest.mock('./employee-information.service');

describe('EmployeeInformationController', () => {
  let employeeInformationController: EmployeeInformationController;
  let employeeInformationService: EmployeeInformationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [EmployeeInformationController],
      providers: [EmployeeInformationService],
    }).compile();

    employeeInformationController =
      moduleRef.get<EmployeeInformationController>(
        EmployeeInformationController,
      );
    employeeInformationService = moduleRef.get<EmployeeInformationService>(
      EmployeeInformationService,
    );
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let employeeInformation: EmployeeInformation;
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenantId',
        } as any;
        (employeeInformationService.create as jest.Mock).mockResolvedValue(
          employeeInformationData(),
        );
        employeeInformation = await employeeInformationController.create(
          createEmployeeInformationData(),
          request['tenantId'],
        );
      });

      test('then it should call employeeInformationService.create with correct parameters', () => {
        expect(employeeInformationService.create).toHaveBeenCalledWith(
          createEmployeeInformationData(),
          request['tenantId'],
        );
      });

      test('then it should return the created employee information', () => {
        expect(employeeInformation).toEqual(employeeInformationData());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenantId',
        } as any;

        (employeeInformationService.findAll as jest.Mock).mockResolvedValue(
          paginationResultEmployeeInformationData(),
        );

        await employeeInformationController.findAll(
          request,
          paginationOptions(),
          searchFilter(),
        );
      });

      test('then it should call employeeInformationService.findAll with correct parameters', () => {
        expect(employeeInformationService.findAll).toHaveBeenCalledWith(
          paginationOptions(),
          searchFilter(),
          request['tenantId'],
        );
      });

      test('then it should return all employee information with pagination', async () => {
        const result = await employeeInformationController.findAll(
          request,
          paginationOptions(),
          searchFilter(),
        );
        expect(result).toEqual(paginationResultEmployeeInformationData());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let employeeInformation: EmployeeInformation;

      beforeEach(async () => {
        (employeeInformationService.findOne as jest.Mock).mockResolvedValue(
          employeeInformationData(),
        );
        employeeInformation = await employeeInformationController.findOne(
          employeeInformationData().id,
        );
      });

      test('then it should call employeeInformationService.findOne with correct parameters', () => {
        expect(employeeInformationService.findOne).toHaveBeenCalledWith(
          employeeInformationData().id,
        );
      });

      test('then it should return the employee information', () => {
        expect(employeeInformation).toEqual(employeeInformationData());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let employeeInformation: EmployeeInformation;
      let updateEmployeeInformationDto: UpdateEmployeeInformationDto;
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenantId',
        } as any;

        updateEmployeeInformationDto = {
          ...employeeInformationData(),
        };

        (employeeInformationService.update as jest.Mock).mockResolvedValue(
          employeeInformationData(),
        );

        employeeInformation = await employeeInformationController.update(
          employeeInformationData().id,
          createEmployeeInformationData(),
        );
      });

      test('then it should call employeeInformationService.update with correct parameters', () => {
        expect(employeeInformationService.update).toHaveBeenCalledWith(
          employeeInformationData().id,
          createEmployeeInformationData(),
        );
      });

      test('then it should return the updated employee information', () => {
        expect(employeeInformation).toEqual(employeeInformationData());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        await employeeInformationController.remove(
          employeeInformationData().id,
        );
      });

      test('then it should call employeeInformationService.remove with correct parameters', () => {
        expect(employeeInformationService.remove).toHaveBeenCalledWith(
          employeeInformationData().id,
        );
      });

      test('then it should resolve with void', async () => {
        expect(
          await employeeInformationController.remove(
            employeeInformationData().id,
          ),
        ).toEqual('Promise resolves with void');
      });
    });
  });
});
