import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationFilesService } from './organization-files.service';
import { OrganizationFile } from '@root/dist/app/modules/organization-files/entities/organization-file.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mock } from 'jest-mock-extended';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { FileUploadService } from '@root/src/core/upload/upload.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateOrganizationFileDto } from './dto/create-organization-file.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { mockOrganizationFile, mockOrganizationFileCreateData } from './tests/organization-files.data';

describe('OrganizationFilesService', () => {
  let service: OrganizationFilesService;
  let repository: jest.Mocked<Repository<OrganizationFile>>;
  let paginationService: jest.Mocked<PaginationService>;
  let fileUploadService: jest.Mocked<FileUploadService>;

  const organizationFileRepositoryToken = getRepositoryToken(
    OrganizationFile,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationFilesService,
        {
          provide: organizationFileRepositoryToken,
          useValue: mock<Repository<OrganizationFile>>(),
        },
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
        {
          provide: FileUploadService,
          useValue: mock<FileUploadService>(),
        },
      ],
    }).compile();

    service = module.get<OrganizationFilesService>(OrganizationFilesService);
    repository = module.get(organizationFileRepositoryToken);
    paginationService = module.get(PaginationService);
    fileUploadService = module.get(FileUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrganizationFile', () => {
    it('should create and save an organization file', async () => {
      const createDto: CreateOrganizationFileDto = { files: [], tenantId: '' };
      const documentMock: Express.Multer.File[] = [
        { originalname: 'file1.pdf', buffer: Buffer.from('data') } as any,
      ];

      fileUploadService.uploadFileToServer.mockResolvedValue({
        viewImage: 'uploaded-path/file1.pdf',
      });
      repository.create.mockReturnValue(mockOrganizationFile);
      repository.save.mockResolvedValue(mockOrganizationFile);

      const result = await service.createOrganizationFile(
        createDto,
        documentMock,
        'd5b88156-1d93-4c99-b6c5-a6e15c3b6f36',
      );

      expect(fileUploadService.uploadFileToServer).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        files: ['uploaded-path/file1.pdf'],
        tenantId: 'd5b88156-1d93-4c99-b6c5-a6e15c3b6f36',
      });
      expect(result).toEqual(mockOrganizationFile);
    });

    it('should throw a ConflictException if an error occurs', async () => {
      const createDto: CreateOrganizationFileDto = { files: [], tenantId: '' };
      const documentMock: Express.Multer.File[] = [];

      repository.save.mockRejectedValue(new Error('Save error'));

      await expect(
        service.createOrganizationFile(createDto, documentMock, 'd5b88156-1d93-4c99-b6c5-a6e15c3b6f36'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAllOrganizationFiles', () => {
    it('should return paginated results', async () => {
      const paginationOptions: PaginationDto = {
        page: 1,
        limit: 10,
        orderBy: 'id',
        orderDirection: 'ASC',
      };

      paginationService.paginate.mockResolvedValue({
        items: [mockOrganizationFile],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      });

      const result = await service.findAllOrganizationFiles(
        'd5b88156-1d93-4c99-b6c5-a6e15c3b6f36',
        paginationOptions,
      );

      expect(paginationService.paginate).toHaveBeenCalled();
      expect(result.items).toEqual([mockOrganizationFile]);
    });

    it('should throw NotFoundException if no files are found', async () => {
      paginationService.paginate.mockRejectedValue(
        new Error('EntityNotFoundError'),
      );

      await expect(
        service.findAllOrganizationFiles('d5b88156-1d93-4c99-b6c5-', { page: 1, limit: 10 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneOrganizationFile', () => {
    it('should return a single organization file', async () => {
      repository.findOneOrFail.mockResolvedValue(mockOrganizationFile);

      const result = await service.findOneOrganizationFile('a8e5c4ad-bf9b-41f6-8dc1-2b0ec7326fc7');

      expect(repository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 'a8e5c4ad-bf9b-41f6-8dc1-2b0ec7326fc7' },
      });
      expect(result).toEqual(mockOrganizationFile);
    });

    it('should throw NotFoundException if the file is not found', async () => {
      repository.findOneOrFail.mockRejectedValue(
        new Error('EntityNotFoundError'),
      );

      await expect(service.findOneOrganizationFile('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateOrganizationFile', () => {
    it('should update an organization file', async () => {
      const updateDto = { files: ['new-file.pdf'] };

      repository.findOneOrFail.mockResolvedValue(mockOrganizationFile);
      repository.update.mockResolvedValue(undefined);

      const result = await service.updateOrganizationFile('test-id', updateDto);

      expect(repository.update).toHaveBeenCalledWith(
        { id: 'test-id' },
        updateDto,
      );
      expect(result).toEqual(mockOrganizationFile);
    });

    it('should throw NotFoundException if the file is not found', async () => {
      repository.findOneOrFail.mockRejectedValue(
        new Error('EntityNotFoundError'),
      );

      await expect(
        service.updateOrganizationFile('invalid-id', { files: [] }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeOrganizationFile', () => {
    it('should soft delete an organization file', async () => {
      repository.findOneOrFail.mockResolvedValue(mockOrganizationFile);
      repository.softDelete.mockResolvedValue(undefined);

      await service.removeOrganizationFile('test-id');

      expect(repository.softDelete).toHaveBeenCalledWith({ id: 'test-id' });
    });

    it('should throw NotFoundException if the file is not found', async () => {
      repository.findOneOrFail.mockRejectedValue(
        new Error('EntityNotFoundError'),
      );

      await expect(service.removeOrganizationFile('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
