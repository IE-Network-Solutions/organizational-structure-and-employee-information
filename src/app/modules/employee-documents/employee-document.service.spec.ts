import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployeeDocument } from './entities/employee-documents.entity';
import { EmployeeDocumentService } from './employee-document.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { FileUploadService } from '@root/src/core/commonServices/upload.service';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { MockProxy, mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import {
    createEmployeeDocumentData,
    employeeDocumentDataSave,
    paginationResultEmployeeDocumentData,
    updateEmployeeDocumentData,
} from './tests/employee-documents.data';

describe('EmployeeDocumentService', () => {
    let employeeDocumentService: EmployeeDocumentService;
    let employeeDocumentRepository: MockProxy<Repository<EmployeeDocument>>;
    let paginationService: MockProxy<PaginationService>;
    let fileUploadService: MockProxy<FileUploadService>;

    const employeeDocumentToken = getRepositoryToken(EmployeeDocument);

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                EmployeeDocumentService,
                {
                    provide: PaginationService,
                    useValue: mock<PaginationService>(),
                },
                {
                    provide: FileUploadService,
                    useValue: mock<FileUploadService>(),
                },
                {
                    provide: employeeDocumentToken,
                    useValue: mock<Repository<EmployeeDocument>>(),
                },
            ],
        }).compile();

        employeeDocumentService = moduleRef.get<EmployeeDocumentService>(EmployeeDocumentService);
        employeeDocumentRepository = moduleRef.get(employeeDocumentToken);
        paginationService = moduleRef.get(PaginationService);
        fileUploadService = moduleRef.get(FileUploadService);
    });

    describe('create', () => {
        describe('when create is called', () => {
            const createEmployeeDocumentDto = createEmployeeDocumentData();
            const documentName = { originalname: 'doc.pdf', buffer: Buffer.from('') } as Express.Multer.File;
            const tenantId = 'tenant-id';
            const uploadedDocumentPath = { viewImage: 'path/to/view', image: 'path/to/image' };

            beforeEach(() => {
                fileUploadService.uploadFileToServer.mockResolvedValue(uploadedDocumentPath);
                employeeDocumentRepository.create.mockReturnValue(createEmployeeDocumentDto as any);
                employeeDocumentRepository.save.mockResolvedValue(employeeDocumentDataSave() as any);
            });

            it('should call fileUploadService.uploadFileToServer', async () => {
                await employeeDocumentService.create(createEmployeeDocumentDto, documentName, tenantId);
                expect(fileUploadService.uploadFileToServer).toHaveBeenCalledWith(tenantId, documentName);
            });

            it('should call employeeDocumentRepository.create and save', async () => {
                await employeeDocumentService.create(createEmployeeDocumentDto, documentName, tenantId);
                expect(employeeDocumentRepository.create).toHaveBeenCalledWith({
                    ...createEmployeeDocumentDto,
                    documentName: uploadedDocumentPath.viewImage,
                    documentLink: uploadedDocumentPath.image,
                });
                expect(employeeDocumentRepository.save).toHaveBeenCalled();
            });

            it('should return the created employee document', async () => {
                const result = await employeeDocumentService.create(createEmployeeDocumentDto, documentName, tenantId);
                expect(result).toEqual(employeeDocumentDataSave());
            });

            it('should throw ConflictException on error', async () => {
                employeeDocumentRepository.save.mockRejectedValue(new Error('Conflict'));
                await expect(employeeDocumentService.create(createEmployeeDocumentDto, documentName, tenantId))
                    .rejects
                    .toThrow(ConflictException);
            });
        });
    });

    describe('findAll', () => {
        describe('when findAll is called', () => {
            const paginationOptions: PaginationDto = { page: 1, limit: 10 };

            beforeEach(() => {
                const paginationResult = paginationResultEmployeeDocumentData();
                paginationService.paginate.mockResolvedValue(paginationResult);
                employeeDocumentRepository.createQueryBuilder.mockReturnValue({
                    orderBy: jest.fn().mockReturnThis(),
                } as any);
            });

            it('should call paginationService.paginate', async () => {
                await employeeDocumentService.findAll(paginationOptions);
                expect(paginationService.paginate).toHaveBeenCalledWith(expect.any(Object), {
                    page: paginationOptions.page,
                    limit: paginationOptions.limit,
                });
            });

            it('should return paginated results', async () => {
                const result = await employeeDocumentService.findAll(paginationOptions);
                expect(result).toEqual(paginationResultEmployeeDocumentData());
            });
        });
    });

    describe('findOne', () => {
        describe('when findOne is called', () => {
            const id = 'some-id';

            beforeEach(() => {
                employeeDocumentRepository.createQueryBuilder.mockReturnValue({
                    where: jest.fn().mockReturnThis(),
                    getOne: jest.fn().mockResolvedValue(employeeDocumentDataSave()),
                } as any);
            });

            it('should call employeeDocumentRepository.createQueryBuilder', async () => {
                await employeeDocumentService.findOne(id);
                expect(employeeDocumentRepository.createQueryBuilder).toHaveBeenCalledWith('employee_document');
                expect(employeeDocumentRepository.createQueryBuilder().where).toHaveBeenCalledWith('employee_document.id = :id', { id });
            });

            it('should return the employee document', async () => {
                const result = await employeeDocumentService.findOne(id);
                expect(result).toEqual(employeeDocumentDataSave());
            });
        });
    });

    describe('update', () => {
        describe('when update is called', () => {
            const id = 'some-id';

            beforeEach(() => {
                employeeDocumentRepository.findOneOrFail.mockResolvedValue(employeeDocumentDataSave() as any);
                employeeDocumentRepository.update.mockResolvedValue(updateEmployeeDocumentData() as any);
                employeeDocumentRepository.findOneOrFail.mockResolvedValue(employeeDocumentDataSave() as any);
            });

            it('should call employeeDocumentRepository.findOneOrFail', async () => {
                await employeeDocumentService.update(id, createEmployeeDocumentData());
                expect(employeeDocumentRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id } });
            });

            it('should call employeeDocumentRepository.update', async () => {
                await employeeDocumentService.update(id, createEmployeeDocumentData());
                expect(employeeDocumentRepository.update).toHaveBeenCalledWith({ id }, createEmployeeDocumentData());
            });

            it('should return the updated employee document', async () => {
                const result = await employeeDocumentService.update(id, createEmployeeDocumentData());
                expect(result).toEqual(employeeDocumentDataSave());
            });
        });
    });

    describe('remove', () => {
        describe('when remove is called', () => {
            const id = 'some-id';

            beforeEach(() => {
                employeeDocumentRepository.findOneOrFail.mockResolvedValue(employeeDocumentDataSave() as any);
                employeeDocumentRepository.softDelete.mockResolvedValue({ affected: 1 } as any);
            });

            it('should call employeeDocumentRepository.findOneOrFail', async () => {
                await employeeDocumentService.remove(id);
                expect(employeeDocumentRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id } });
            });

            it('should call employeeDocumentRepository.softDelete', async () => {
                await employeeDocumentService.remove(id);
                expect(employeeDocumentRepository.softDelete).toHaveBeenCalledWith({ id });
            });

            it('should return void on successful removal', async () => {
                const result = await employeeDocumentService.remove(id);
                expect(result).toEqual({ affected: 1 });
            });
        });
    });
});
