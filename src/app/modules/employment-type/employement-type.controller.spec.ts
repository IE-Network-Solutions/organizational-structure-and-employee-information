import { Test } from '@nestjs/testing';

import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { EmployementTypesController } from './employement-type.controller';
import { EmployementTypeService } from './employement-type.service';
import { EmployementType } from './entities/employement-type.entity';
import { createEmployementTypeData, employementTypeData, paginationResultEmploymentTypeData } from './tests/employement-type.data';

jest.mock('./employement-type.service');

describe('EmployementTypesController', () => {
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
                employementType = await employementTypesController.create(
                    createEmployementTypeData(),
                    request['tenantId']
                );
            });

            test('then it should call create', () => {
                expect(employementTypeService.create).toHaveBeenCalledWith(
                    createEmployementTypeData(),
                    request['tenantId']
                );
            });

            test('then it should return a employementType', () => {
                expect(employementType).toEqual(employementTypeData());
            });
        });
    });

    describe('findOne', () => {
        describe('when findOne is called', () => {
            let employementType: EmployementType;
            let request: Request;

            beforeEach(async () => {
                employementType = await employementTypesController.findOne(
                    employementTypeData().id);
            });

            test('then it should call findOne', () => {
                expect(employementTypeService.findOne).toHaveBeenCalledWith(
                    employementTypeData().id,
                );
            });

            test('then it should return  employementType', () => {
                expect(employementType).toEqual(employementTypeData());
            });
        });
    });

    describe('findAll', () => {
        describe('when findAll is called', () => {
            beforeEach(async () => {
                await employementTypesController.findAll(
                    paginationOptions(),);
            });

            test('then it should call findAll service', () => {
                expect(employementTypeService.findAll).toHaveBeenCalledWith(
                    paginationOptions(),
                );
            });

            test('then is should return employementType', async () => {
                expect(await employementTypesController.findAll()).toEqual(
                    paginationResultEmploymentTypeData(),
                );
            });
        });
    });

    describe('update', () => {
        describe('when update is called', () => {
            let employementType: EmployementType;
            let request: Request;

            beforeEach(async () => {
                employementType = await employementTypesController.update(
                    employementTypeData().id,
                    createEmployementTypeData(),
                );
            });

            test('then it should call update', () => {
                expect(employementTypeService.update).toHaveBeenCalledWith(
                    employementTypeData().id,
                    createEmployementTypeData(),
                );
            });

            test('then it should return a employementType', () => {
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
