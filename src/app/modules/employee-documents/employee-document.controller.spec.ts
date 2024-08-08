import { Test } from '@nestjs/testing';
import { EmployeeDocumentController } from './employee-document.controller';
import { EmployeeDocumentService } from './employee-document.service';
import { EmployeeDocument } from './entities/employee-documents.entity';
import { Readable } from 'stream';
import { createEmployeeDocumentData, employeeDocumentData } from './tests/employee-documents.data';
import { paginationOptions } from '@root/dist/core/commonTestData/commonTest.data';

jest.mock('./employee-document.service');
describe('EmployeeDocumentController', () => {
    let employeeDocumentController: EmployeeDocumentController;
    let employeeDocumentService: EmployeeDocumentService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [EmployeeDocumentController],
            providers: [EmployeeDocumentService],
        }).compile();

        employeeDocumentController = moduleRef.get<EmployeeDocumentController>(EmployeeDocumentController);
        employeeDocumentService = moduleRef.get<EmployeeDocumentService>(EmployeeDocumentService);
        jest.clearAllMocks();
    });

    describe('create', () => {
        describe('when create is called', () => {
            let employeeDocument: EmployeeDocument;
            const file: Express.Multer.File = {
                fieldname: 'documentName',
                originalname: 'file.pdf',
                encoding: '7bit',
                mimetype: 'application/pdf',
                size: 1024,
                destination: '',
                filename: 'file.pdf',
                path: '',
                buffer: Buffer.from(''),
                stream: new Readable
            };

            beforeEach(async () => {
                employeeDocument = await employeeDocumentController.create(
                    { tenantId: 'tenant-1' } as any,
                    createEmployeeDocumentData(),
                    file,
                );
            });

            test('then it should call EmployeeDocumentService', () => {
                expect(employeeDocumentService.create).toHaveBeenCalledWith(
                    createEmployeeDocumentData(),
                    file,
                    'tenant-1',
                );
            });
        });
    });

    describe('findAll', () => {
        describe('when findAll is called', () => {

            beforeEach(async () => {
                await employeeDocumentController.findAll(paginationOptions());
            });

            test('then it should call EmployeeDocumentService', () => {
                expect(employeeDocumentService.findAll).toHaveBeenCalledWith(paginationOptions());
            });

            // test('then it should return paginated employee documents', async () => {
            //     expect(await employeeDocumentController.findAll(paginationOptions())).toEqual(
            //         paginationResultEmployeeDocumentData(),
            //     );
            // });
        });
    });

    describe('findOne', () => {
        describe('when findOne is called', () => {
            let employeeDocument: EmployeeDocument;

            beforeEach(async () => {
                employeeDocument = await employeeDocumentController.findOne(employeeDocumentData().id);
            });

            test('then it should call EmployeeDocumentService', () => {
                expect(employeeDocumentService.findOne).toHaveBeenCalledWith(employeeDocumentData().id);
            })
        })
    });

    describe('update', () => {
        describe('when update is called', () => {
            let employeeDocument: EmployeeDocument;

            beforeEach(async () => {
                employeeDocument = await employeeDocumentController.update(employeeDocumentData().id, employeeDocumentData() as any);
            });

            test('then it should call EmployeeDocumentService', () => {
                expect(employeeDocumentService.update).toHaveBeenCalledWith(
                    employeeDocumentData().id,
                    employeeDocumentData(),
                );
            });
        });
    });

    describe('remove', () => {
        describe('when remove is called', () => {
            beforeEach(async () => {
                await employeeDocumentController.remove(employeeDocumentData().id);
            });

            test('then it should call EmployeeDocumentService', () => {
                expect(employeeDocumentService.remove).toHaveBeenCalledWith(employeeDocumentData().id);
            });

            test('then it should return a promise', async () => {
                expect(await employeeDocumentController.remove(employeeDocumentData().id)).toBeUndefined();
            });
        });
    });
});
