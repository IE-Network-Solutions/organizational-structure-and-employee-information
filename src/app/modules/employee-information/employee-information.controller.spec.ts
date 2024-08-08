import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeInformationController } from './employee-information.controller';
import { EmployeeInformationService } from './employee-information.service';
import { UpdateEmployeeInformationDto } from './dto/update-employee-information.dto';
import { paginationResultEmployeeInformationData, createEmployeeInformationData, employeeInformationDataSave, employeeInformationData } from './tests/employee-information.data';
import { EmployeeInformation } from './entities/employee-information.entity';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';

describe('EmployeeInformationController', () => {
    let employeeInformationController: EmployeeInformationController;
    let employeeInformationService: EmployeeInformationService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EmployeeInformationController],
            providers: [
                {
                    provide: EmployeeInformationService,
                    useValue: EmployeeInformationService,
                },
            ],
        }).compile();

        employeeInformationController = module.get<EmployeeInformationController>(EmployeeInformationController);
        employeeInformationService = module.get<EmployeeInformationService>(EmployeeInformationService);
    });
    describe('create', () => {
        describe('when create is called', () => {
            let employeeInformation: EmployeeInformation;
            let request: Request;

            beforeEach(async () => {
                request = {
                    tenantId: 'tenantId',
                } as any;
                employeeInformation = await employeeInformationController.create(createEmployeeInformationData(), request['tenantId']);
            });

            test('then it should return a employeeInformation', () => {
                expect(employeeInformation).toEqual(employeeInformationData());
            });
        });
    });

    describe('findAll', () => {
        describe('when findAll is called', () => {
            let request: Request;

            beforeEach(async () => {
                request = {
                    tenantId: 'tenantId', // Mock tenantId
                } as any;

                await employeeInformationController.findAll(request['tenantId'], paginationOptions());
            });

            test('then it should call employeeInformationService.findAll with correct parameters', () => {
                expect(employeeInformationService.findAll).toHaveBeenCalledWith(
                    request['tenantId'],
                    paginationOptions());
            });

            test('then it should return all employeeInformation', async () => {
                const result = await employeeInformationController.findAll(request['tenantId'], paginationOptions());
                expect(result).toEqual(paginationResultEmployeeInformationData());
            });
        });
    });

    describe('findOne', () => {
        describe('when findOne is called', () => {
            let employeeInformation: EmployeeInformation;

            beforeEach(async () => {
                employeeInformation = await employeeInformationController.findOne(employeeInformationData().id);
            });

            test('then it should call employeeInformationService', () => {
                expect(employeeInformationService.findOne).toHaveBeenCalledWith(employeeInformationData().id);
            });

            test('then it should return employeeInformation', () => {
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

                (employeeInformationService.update as jest.Mock).mockResolvedValue(employeeInformationData());

                employeeInformation = await employeeInformationController.update(
                    employeeInformationData().id,
                    updateEmployeeInformationDto,
                );
            });

            test('then it should call employeeInformationService.update with correct parameters', () => {
                expect(employeeInformationService.update).toHaveBeenCalledWith(
                    employeeInformationData().id,
                    updateEmployeeInformationDto,
                );
            });

            test('then it should return the updated employeeInformation', () => {
                expect(employeeInformation).toEqual(employeeInformationData());
            });
        });
    });

    describe('remove', () => {
        describe('when remove is called', () => {
            beforeEach(async () => {
                await employeeInformationController.remove(employeeInformationData().id);
            });

            test('then it should call remove', () => {
                expect(employeeInformationService.remove).toHaveBeenCalledWith(employeeInformationData().id);
            });

            test('then it should return a employeeInformation', async () => {
                expect(await employeeInformationController.remove(employeeInformationData().id)).toEqual(
                    'Promise resolves with void',
                );
            });
        });
    });
});
