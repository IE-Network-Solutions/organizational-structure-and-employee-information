import { Test } from '@nestjs/testing';

import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { searchFilter } from '@root/src/core/commonTestData/search-filter.data';
import { EmployementTypesController } from './employement-type.controller';
import { EmployementTypeService } from './employement-type.service';
import { EmployementType } from './entities/employement-type.entity';
import {
  createEmployementTypeData,
  employementTypeData,
  paginationResultEmploymentTypeData,
} from './tests/employement-type.data';
import { UpdateEmployementTypeDto } from './dto/update-employement-type.dto';

jest.mock('./employement-type.service');

describe('EmployementTypeController', () => {
  let employementTypesController: EmployementTypesController;
  let employementTypeService: EmployementTypeService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [EmployementTypesController],
      providers: [EmployementTypeService],
    }).compile();

    employementTypesController = moduleRef.get<EmployementTypesController>(
      EmployementTypesController,
    );
    employementTypeService = moduleRef.get<EmployementTypeService>(
      EmployementTypeService,
    );
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let employementType: EmployementType;
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenantId',
        } as any;

        (employementTypeService.create as jest.Mock).mockResolvedValue(
          employementTypeData(),
        );
        employementType = await employementTypesController.create(
          createEmployementTypeData(),
          request,
        );
      });

      test('then it should call employementTypeService.create with correct parameters', () => {
        expect(employementTypeService.create).toHaveBeenCalledWith(
          createEmployementTypeData(),
          request['tenantId'],
        );
      });

      test('then it should return a employementType', () => {
        expect(employementType).toEqual(employementTypeData());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let request: Request;

      beforeEach(async () => {
        // Mock request object with tenantId
        request = {
          tenantId: 'tenantId', // Mock tenantId
        } as any;

        (employementTypeService.findAll as jest.Mock).mockResolvedValue(
          paginationResultEmploymentTypeData(),
        );

        await employementTypesController.findAll(paginationOptions());
      });

      test('then it should call employementTypeService.findAll with correct parameters', () => {
        expect(employementTypeService.findAll).toHaveBeenCalledWith(
          paginationOptions(),
        );
      });

      test('then it should return all employementType', async () => {
        const result = await employementTypeService.findAll(
          paginationOptions(),
        );
        expect(result).toEqual(paginationResultEmploymentTypeData());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let employementType: EmployementType;

      beforeEach(async () => {
        employementType = await employementTypesController.findOne(
          employementTypeData().id,
        );
      });

      test('then it should call employementTypeService', () => {
        expect(employementTypeService.findOne).toHaveBeenCalledWith(
          employementTypeData().id,
        );
      });

      test('then it should return employementType', () => {
        expect(employementType).toEqual(employementTypeData());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let employementType: EmployementType;
      let updateEmployementTypeDto: UpdateEmployementTypeDto;
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenantId',
        } as any;

        (employementTypeService.update as jest.Mock).mockResolvedValue(
          employementTypeData(),
        );

        employementType = await employementTypesController.update(
          employementTypeData().id,
          updateEmployementTypeDto,
        );
      });

      test('then it should call employementTypeService.update with correct parameters', () => {
        expect(employementTypeService.update).toHaveBeenCalledWith(
          employementTypeData().id,
          updateEmployementTypeDto,
        );
      });

      test('then it should return the updated employementType', () => {
        expect(employementType).toEqual(employementTypeData());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        await employementTypesController.remove(employementTypeData().id);
      });

      test('then it should call remove', () => {
        expect(employementTypeService.remove).toHaveBeenCalledWith(
          employementTypeData().id,
        );
      });

      test('then it should return a employementType', async () => {
        expect(
          await employementTypesController.remove(employementTypeData().id),
        ).toEqual('Promise resolves with void');
      });
    });
  });
});
