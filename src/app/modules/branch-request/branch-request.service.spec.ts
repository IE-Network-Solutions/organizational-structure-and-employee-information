import { Test, TestingModule } from '@nestjs/testing';
import { BranchRequestService } from './branch-request.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockProxy, mock } from 'jest-mock-extended';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BranchRequest } from './entities/branch-request.entity';
import {
  branchRequestData,
  paginationResultbranchRequestData,
  createbranchRequestDataOnCreate,
  updatebranchRequestData,
  tenantId,
  UpdatebranchRequestDataReturned,
} from './tests/branchRequest.data';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { EmployeeJobInformationService } from '../employee-job-information/employee-job-information.service';

describe('BranchRequestService', () => {
  let service: BranchRequestService;
  let repository: MockProxy<Repository<BranchRequest>>;
  let paginationService: MockProxy<PaginationService>;
  let employeeJobInfoService: MockProxy<EmployeeJobInformationService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchRequestService,
        {
          provide: getRepositoryToken(BranchRequest),
          useValue: mock<Repository<BranchRequest>>(),
        },
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
        {
          provide: EmployeeJobInformationService,
          useValue: mock<EmployeeJobInformationService>(),
        },
        {
          provide: ConfigService,
          useValue: mock<ConfigService>(),
        },
        {
          provide: HttpService,
          useValue: mock<HttpService>(),
        },
      ],
    }).compile();

    service = module.get<BranchRequestService>(BranchRequestService);
    repository = module.get(getRepositoryToken(BranchRequest));
    paginationService = module.get(PaginationService);
    employeeJobInfoService = module.get(EmployeeJobInformationService);
  });

  describe('create', () => {
    it('should successfully create a new branch request', async () => {
      const createBranchRequestDto = createbranchRequestDataOnCreate();
      const savedBranchRequest = branchRequestData();
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';

      repository.create.mockReturnValue(savedBranchRequest);
      repository.save.mockResolvedValue(savedBranchRequest);

      const result = await service.create(createBranchRequestDto, tenantId);

      expect(result).toEqual(savedBranchRequest);
      expect(repository.create).toHaveBeenCalledWith({
        ...createBranchRequestDto,
        tenantId,
      });
      expect(repository.save).toHaveBeenCalledWith(savedBranchRequest);
    });

    it('should throw BadRequestException on creation error', async () => {
      const createBranchRequestDto = createbranchRequestDataOnCreate();
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';

      repository.save.mockRejectedValue(new Error('Save Error'));

      await expect(
        service.create(createBranchRequestDto, tenantId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findBranch', () => {
    beforeEach(() => {
      repository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(branchRequestData()),
      } as any);
    });
    it('should return a branch request by ID', async () => {
      const branchRequest = await branchRequestData();
      const result = await service.findBranch(branchRequest.id);
      expect(await service.findBranch(branchRequest.id)).toEqual(branchRequest);
    });
  });
  describe('findOne', () => {
    it('should return a branch request by ID', async () => {
      const branchRequest = branchRequestData();
      repository.findOneByOrFail.mockResolvedValue({
        ...branchRequest,
        currentBranch: branchRequest.currentBranch,
        requestBranch: branchRequest.requestBranch,
      });

      const result = await service.findOne(branchRequest.id);
      expect(result).toEqual(branchRequest);
      expect(repository.findOneByOrFail).toHaveBeenCalledWith({
        id: branchRequest.id,
      });
    });

    it('should throw NotFoundException if branch request not found', async () => {
      repository.findOneByOrFail.mockRejectedValue(
        new NotFoundException('Branch request not found'),
      );

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOneByOrFail).toHaveBeenCalledWith({
        id: 'invalid-id',
      });
    });
  });

  describe('update', () => {
    it('should update the branch request successfully', async () => {
      const updateDto = updatebranchRequestData();
      const branchRequest = branchRequestData();

      jest.spyOn(service, 'findOne').mockResolvedValue(branchRequest);
      repository.update.mockResolvedValueOnce(
        UpdatebranchRequestDataReturned(),
      );
      const result = await service.update(branchRequest.id, updateDto);

      expect(result).toEqual({ ...branchRequest, ...updateDto });
      expect(repository.update).toHaveBeenCalledWith(
        branchRequest.id,
        updateDto,
      );
    });

    it('should throw NotFoundException if branch request not found during update', async () => {
      const nonExistingId = 'non-existing-id';

      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException(
            `BranchRequest with Id ${nonExistingId} not found`,
          ),
        );

      await expect(
        service.update(nonExistingId, updatebranchRequestData()),
      ).rejects.toThrow(NotFoundException);

      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a branch request successfully', async () => {
      const branchRequest = branchRequestData();
      jest.spyOn(service, 'findOne').mockResolvedValue(branchRequest);
      repository.softRemove.mockResolvedValue(branchRequest);

      const result = await service.remove(branchRequest.id);

      expect(result).toEqual(branchRequest);
      expect(repository.softRemove).toHaveBeenCalledWith({
        id: branchRequest.id,
      });
    });

    it('should throw NotFoundException if branch request not found during removal', async () => {
      const nonExistingId = 'non-existing-id';

      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException(
            `BranchRequest with Id ${nonExistingId} not found`,
          ),
        );

      await expect(service.remove(nonExistingId)).rejects.toThrow(
        NotFoundException,
      );

      expect(repository.softRemove).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException on remove error', async () => {
      const branchRequest = branchRequestData();

      jest.spyOn(service, 'findOne').mockResolvedValue(branchRequest);

      repository.softRemove.mockRejectedValue(new Error('Remove Error'));

      await expect(service.remove(branchRequest.id)).rejects.toThrow(
        new BadRequestException('Remove Error'),
      );

      expect(repository.softRemove).toHaveBeenCalledWith({
        id: branchRequest.id,
      });
    });
  });
});
