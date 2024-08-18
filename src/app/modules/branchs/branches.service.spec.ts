import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { mock, MockProxy } from 'jest-mock-extended';

import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { BranchesService } from './branches.service';
import { Branch } from './entities/branch.entity';
import {
  branchData,
  createbranchData,
  createbranchDataOnCreate,
  createbranchDataOnSave,
  deletebranchData,
  paginationResultbranchData,
  updatebranchData,
  UpdatebranchDataReturned,
} from './tests/branch.data';

describe('BranchesService', () => {
  let branchesService: BranchesService;
  let branchRepository: MockProxy<Repository<Branch>>;
  let paginationService: MockProxy<PaginationService>;
  const branchToken = getRepositoryToken(Branch);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BranchesService,
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(), // Use mock for PaginationService
        },
        {
          provide: branchToken,
          useValue: mock<Repository<Branch>>(),
        },
      ],
    }).compile();

    branchesService = moduleRef.get<BranchesService>(BranchesService);
    branchRepository = moduleRef.get(branchToken);
    paginationService = moduleRef.get(PaginationService); // Get an instance of PaginationService
  });

  describe('create', () => {
    describe('when createBranch is called', () => {
      let branch: Branch;
      let tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      beforeEach(() => {
        branchRepository.create.mockReturnValue(createbranchData() as any);
        branchRepository.save.mockResolvedValue(branchData());
      });
      it('should call branchRepository.findone wiht email address ', async () => {
        await branchesService.createBranch(createbranchData(), tenantId);
        expect(branchRepository.findOne).toHaveBeenCalledWith({
          where: {
            contactEmail: createbranchData().contactEmail,
            tenantId: tenantId,
          },
        });
      });

      it('should call branchRepository.create', async () => {
        await branchesService.createBranch(createbranchData(), tenantId);
        expect(branchRepository.create).toHaveBeenCalledWith({
          ...createbranchData(),
          tenantId: tenantId,
        });
      });

      it('should call branchRepository.save', async () => {
        await branchesService.createBranch(createbranchData(), tenantId);
        expect(branchRepository.save).toHaveBeenCalledWith(createbranchData());
      });

      it('should return the created Branch', async () => {
        branch = await branchesService.createBranch(
          createbranchData(),
          tenantId,
        );
        expect(branch).toEqual(branchData());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOneBranch is called', () => {
      let branch: Branch;

      beforeEach(async () => {
        branchRepository.findOneByOrFail.mockResolvedValue(branchData());
        branch = await branchesService.findOneBranch(branchData().id);
      });

      it('should call branchRepository.findOne', async () => {
        await branchesService.findOneBranch(branchData().id);
        expect(branchRepository.findOneByOrFail).toHaveBeenCalledWith({
          id: branchData().id,
        });
      });

      it('should return the Branch', () => {
        expect(branch).toEqual(branchData());
      });

      it('should throw NotFoundException if id is not found', async () => {
        const wrongId = '4567';
        branchRepository.findOneByOrFail.mockRejectedValue(
          new Error('Branch not found'),
        );

        await expect(branchesService.findOneBranch(wrongId)).rejects.toThrow(
          NotFoundException,
        );
        await expect(branchesService.findOneBranch(wrongId)).rejects.toThrow(
          `Branch with Id ${wrongId} not found`,
        );
      });
    });
  });

  describe('findAll', () => {
    describe('when findAllBranchs is called', () => {
      let tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      beforeEach(async () => {
        paginationService.paginate.mockResolvedValue(
          paginationResultbranchData(),
        );
      });

      it('should call paginationService.paginate with correct parameters', async () => {
        await branchesService.findAllBranchs(paginationOptions(), tenantId);
        expect(paginationService.paginate).toHaveBeenCalledWith(
          branchRepository,
          'p',
          {
            page: paginationOptions().page,
            limit: paginationOptions().limit,
          },
          paginationOptions().orderBy,
          paginationOptions().orderDirection,
          { tenantId },
        );
      });

      it('should return paginated Branchs', async () => {
        const branchs = await branchesService.findAllBranchs(
          paginationOptions(),
          tenantId,
        );
        expect(branchs).toEqual(paginationResultbranchData());
      });
    });
  });

  describe('update', () => {
    describe('when updatebranch is called', () => {
      let branch: Branch;
      let companyProfileImage: Express.Multer.File;
      beforeEach(async () => {
        jest
          .spyOn(branchesService, 'findOneBranch')
          .mockResolvedValue(branchData());
        branchRepository.update.mockResolvedValue(UpdatebranchDataReturned());
      });

      it('should call branchService.findOneBranch', async () => {
        await branchesService.updateBranch(branchData().id, createbranchData());
        expect(branchesService.findOneBranch).toHaveBeenCalledWith(
          branchData().id,
        );
      });

      it('should call branchRepository.update', async () => {
        await branchesService.updateBranch(branchData().id, updatebranchData());
        expect(branchRepository.update).toHaveBeenCalledWith(
          branchData().id,
          updatebranchData(),
        );
      });

      it('should return the updated branch', async () => {
        branch = await branchesService.updateBranch(
          branchData().id,
          updatebranchData(),
        );
        expect(branch).toEqual(branchData());
      });

      it('should throw NotFoundException if id is not found', async () => {
        const wrongId = '4567';
        jest
          .spyOn(branchesService, 'findOneBranch')
          .mockRejectedValue(
            new NotFoundException(`Branch with Id ${wrongId} not found`),
          );
        await expect(
          branchesService.updateBranch(wrongId, createbranchData()),
        ).rejects.toThrow(NotFoundException);
        await expect(
          branchesService.updateBranch(wrongId, createbranchData()),
        ).rejects.toThrow(`Branch with Id ${wrongId} not found`);
      });
    });
  });

  describe('remove', () => {
    describe('when removeBranch is called', () => {
      beforeEach(async () => {
        jest
          .spyOn(branchesService, 'findOneBranch')
          .mockResolvedValue(branchData());
        branchRepository.delete.mockResolvedValue(deletebranchData());
      });

      it('should call branchService.findOneBranch', async () => {
        await branchesService.removeBranch(branchData().id);
        expect(branchesService.findOneBranch).toHaveBeenCalledWith(
          branchData().id,
        );
      });

      it('should call branchRepository.delete', async () => {
        await branchesService.removeBranch(branchData().id);
        expect(branchRepository.softRemove).toHaveBeenCalledWith({
          id: branchData().id,
        });
      });

      it('should throw NotFoundException if id is not found', async () => {
        const wrongId = '4567';
        jest
          .spyOn(branchesService, 'findOneBranch')
          .mockRejectedValue(
            new NotFoundException(`Branch with Id ${wrongId} not found`),
          );
        await expect(branchesService.removeBranch(wrongId)).rejects.toThrow(
          NotFoundException,
        );
        await expect(branchesService.removeBranch(wrongId)).rejects.toThrow(
          `Branch with Id ${wrongId} not found`,
        );
      });

      it('should return void when the Branch is removed', async () => {
        const result = await branchesService.removeBranch(branchData().id);
        expect(result).toEqual(branchData());
      });
    });
  });
});
