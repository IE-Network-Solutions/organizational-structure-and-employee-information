import { Test, TestingModule } from '@nestjs/testing';
import { BranchesService } from './branches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { Repository } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
// Adjust the path as necessary
import { NotFoundException, BadRequestException, HttpException } from '@nestjs/common';
import { branchData, createbranchData, deletebranchData, paginationResultbranchData, updatebranchData, UpdatebranchDataReturned } from './tests/branch.data';

describe('BranchesService', () => {
  let service: BranchesService;
  let branchRepository: Repository<Branch>;
  let paginationService: PaginationService;

  const mockBranchRepository = {
    create: jest.fn().mockImplementation(dto => branchData()),
    save: jest.fn().mockResolvedValue(branchData()),
    findOneByOrFail: jest.fn().mockImplementation(({ id }) => {
      if (id === '4567') {
        throw new NotFoundException(`Branch with Id ${id} not found`);
      }
      return branchData();
    }),
    update: jest.fn().mockResolvedValue(UpdatebranchDataReturned()),
    softRemove: jest.fn().mockResolvedValue(deletebranchData()),
  };

  const mockPaginationService = {
    paginate: jest.fn().mockResolvedValue(paginationResultbranchData()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchesService,
        { provide: getRepositoryToken(Branch), useValue: mockBranchRepository },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).compile();

    service = module.get<BranchesService>(BranchesService);
    branchRepository = module.get<Repository<Branch>>(getRepositoryToken(Branch));
    paginationService = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a branch', async () => {
    const createBranchDto: CreateBranchDto = createbranchData();
    const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
    const result = await service.createBranch(createBranchDto, tenantId);
    expect(result).toEqual(branchData());
    expect(branchRepository.create).toHaveBeenCalledWith({ ...createBranchDto, tenantId });
    expect(branchRepository.save).toHaveBeenCalledWith(branchData());
  });

  it('should find all branches', async () => {
    const paginationOptions: PaginationDto = { page: 1, limit: 10, orderBy: 'name', orderDirection: 'ASC' };
    const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
    const result = await service.findAllBranchs(paginationOptions, tenantId);
    expect(result).toEqual(paginationResultbranchData());
    expect(paginationService.paginate).toHaveBeenCalledWith(
      branchRepository,
      'p',
      { page: 1, limit: 10 },
      'name',
      'ASC',
      { tenantId },
    );
  });

  it('should find one branch', async () => {
    const result = await service.findOneBranch('be21f28b-4651-4d6f-8f08-d8128da64ee5');
    expect(result).toEqual(branchData());
    expect(branchRepository.findOneByOrFail).toHaveBeenCalledWith({ id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5' });
  });

  it('should throw not found exception for non-existent branch', async () => {
    await expect(service.findOneBranch('4567')).rejects.toThrow(NotFoundException);
    expect(branchRepository.findOneByOrFail).toHaveBeenCalledWith({ id: '4567' });
  });

  it('should update a branch', async () => {
    const updateBranchDto: UpdateBranchDto = updatebranchData();
    const result = await service.updateBranch('be21f28b-4651-4d6f-8f08-d8128da64ee5', updateBranchDto);
    expect(result).toEqual(branchData());
    expect(branchRepository.update).toHaveBeenCalledWith('be21f28b-4651-4d6f-8f08-d8128da64ee5', updateBranchDto);
    expect(branchRepository.findOneByOrFail).toHaveBeenCalledWith({ id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5' });
  });

  it('should throw not found exception for update of non-existent branch', async () => {
    await expect(service.updateBranch('4567', updatebranchData())).rejects.toThrow(NotFoundException);
  });

  it('should remove a branch', async () => {
    const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5'
    const result = await service.removeBranch('be21f28b-4651-4d6f-8f08-d8128da64ee5');
    expect(result).toEqual(branchData());
    expect(branchRepository.softRemove).toHaveBeenCalledWith({ id });
  });

  it('should throw not found exception for remove of non-existent branch', async () => {
    await expect(service.removeBranch('4567')).rejects.toThrow(NotFoundException);
  });
});
