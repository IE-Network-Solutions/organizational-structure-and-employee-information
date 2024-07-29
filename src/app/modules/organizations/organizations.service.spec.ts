import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from './organizations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import {
  organizationData,
  createOrganizationData,
  deleteOrganizationData,
  UpdateOrganizationDataReturned,
  paginationResultOrganizationData,
  updateOrganizationData,
  createOrganizationDataOnCreate,
  findOneNotFoundReturnValue,
} from './tests/organization.data';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let repository: Repository<Organization>;
  let paginationService: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        PaginationService,
        {
          provide: getRepositoryToken(Organization),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
    repository = module.get<Repository<Organization>>(
      getRepositoryToken(Organization),
    );
    paginationService = module.get<PaginationService>(PaginationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrganization', () => {
    it('should create a new organization if one does not exist', async () => {
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';

      jest.spyOn(repository, 'findOne').mockResolvedValue(null); // Simulate no existing organization
      jest.spyOn(repository, 'create').mockReturnValue(organizationData());
      jest.spyOn(repository, 'save').mockResolvedValue(organizationData());

      const result = await service.createOrganiztion(
        createOrganizationData(),
        tenantId,
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { tenantId: tenantId },
      });
      expect(repository.create).toHaveBeenCalledWith({
        ...createOrganizationData(),
        tenantId: tenantId,
      });
      expect(repository.save).toHaveBeenCalledWith(organizationData());
      expect(result).toEqual(organizationData());
    });

    it('should update an existing organization if one exists', async () => {
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      const existingOrganization = organizationData();

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingOrganization);
      jest
        .spyOn(service, 'updateOrganization')
        .mockResolvedValue(existingOrganization);

      const result = await service.createOrganiztion(
        createOrganizationData(),
        tenantId,
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { tenantId: tenantId },
      });
      expect(service.updateOrganization).toHaveBeenCalledWith(
        tenantId,
        existingOrganization.id,
        createOrganizationData(),
      );
      expect(result).toEqual(existingOrganization);
    });

    it('should throw a BadRequestException if there is an error', async () => {
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('Some error'));

      await expect(
        service.createOrganiztion(createOrganizationData(), tenantId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllOrganizations', () => {
    it('should return paginated organizations', async () => {
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      jest
        .spyOn(paginationService, 'paginate')
        .mockResolvedValue(paginationResultOrganizationData());

      const result = await service.findAllOrganizations(
        paginationOptions(),
        tenantId,
      );

      expect(paginationService.paginate).toHaveBeenCalledWith(
        repository,
        'p',
        { page: paginationOptions().page, limit: paginationOptions().limit },
        paginationOptions().orderBy,
        paginationOptions().orderDirection,
        { tenantId },
      );
      expect(result).toEqual(paginationResultOrganizationData());
    });
  });

  describe('findOneOrganization', () => {
    it('should return the organization if found', async () => {
      const id = organizationData().id;
      jest
        .spyOn(repository, 'findOneByOrFail')
        .mockResolvedValue(organizationData());

      const result = await service.findOneOrganization(id);

      expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
      expect(result).toEqual(organizationData());
    });

    it('should throw a NotFoundException if the organization is not found', async () => {
      const id = organizationData().id;
      jest
        .spyOn(repository, 'findOneByOrFail')
        .mockRejectedValue(new Error('Not found'));

      await expect(service.findOneOrganization(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateOrganization', () => {
    it('should update and return the organization if found', async () => {
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      const id = organizationData().id;
      jest
        .spyOn(service, 'findOneOrganization')
        .mockResolvedValue(organizationData());
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.updateOrganization(
        tenantId,
        id,
        updateOrganizationData(),
      );

      expect(service.findOneOrganization).toHaveBeenCalledWith(id);
      expect(repository.update).toHaveBeenCalledWith(id, {
        ...updateOrganizationData(),
        tenantId,
      });
      expect(result).toEqual(organizationData());
    });

    it('should throw a NotFoundException if the organization is not found', async () => {
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      const id = organizationData().id;
      jest
        .spyOn(service, 'findOneOrganization')
        .mockRejectedValue(new NotFoundException());

      await expect(
        service.updateOrganization(tenantId, id, updateOrganizationData()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeOrganization', () => {
    it('should remove and return the organization if found', async () => {
      const id = organizationData().id;
      jest
        .spyOn(service, 'findOneOrganization')
        .mockResolvedValue(organizationData());
      jest
        .spyOn(repository, 'softDelete')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.removeOrganization(id);

      expect(service.findOneOrganization).toHaveBeenCalledWith(id);
      expect(repository.softDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(organizationData());
    });

    it('should throw a NotFoundException if the organization is not found', async () => {
      const id = organizationData().id;
      jest
        .spyOn(service, 'findOneOrganization')
        .mockRejectedValue(new NotFoundException());

      await expect(service.removeOrganization(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
