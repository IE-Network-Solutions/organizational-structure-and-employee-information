import { Test, TestingModule } from '@nestjs/testing';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import {
  branchData,
  createbranchData,
  createbranchDataOnCreate,
  deletebranchData,
  findOneNotFoundReturnValue,
  paginationResultbranchData,
  updatebranchData,
} from './tests/branch.data';

jest.mock('./branches.service');
describe('BranchesController', () => {
  let controller: BranchesController;
  let service: BranchesService;

  const mockBranchesService = {
    createBranch: jest
      .fn()
      .mockImplementation((dto: CreateBranchDto, tenantId: string) => {
        return Promise.resolve(createbranchDataOnCreate());
      }),
    findAllBranchs: jest
      .fn()
      .mockImplementation(
        (paginationOptions: PaginationDto, tenantId: string) => {
          return Promise.resolve(paginationResultbranchData());
        },
      ),
    findOneBranch: jest.fn().mockImplementation((id: string) => {
      if (id === '4567') {
        return Promise.resolve(findOneNotFoundReturnValue());
      }
      return Promise.resolve(branchData());
    }),
    updateBranch: jest
      .fn()
      .mockImplementation((id: string, dto: UpdateBranchDto) => {
        return Promise.resolve(updatebranchData());
      }),
    removeBranch: jest.fn().mockImplementation((id: string) => {
      return Promise.resolve(deletebranchData());
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchesController],
      providers: [
        {
          provide: BranchesService,
          useValue: mockBranchesService,
        },
      ],
    }).compile();

    controller = module.get<BranchesController>(BranchesController);
    service = module.get<BranchesService>(BranchesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a branch', async () => {
    const createBranchDto: CreateBranchDto = createbranchData();
    const req = { tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c' } as any;
    const result = await controller.createBranch(req, createBranchDto);
    expect(result).toEqual(createbranchDataOnCreate());
    expect(service.createBranch).toHaveBeenCalledWith(
      createBranchDto,
      '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    );
  });

  it('should find all branches', async () => {
    const paginationOptions: PaginationDto = { page: 1, limit: 10 };
    const req = { tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c' } as any;
    const result = await controller.findAllBranch(req, paginationOptions);
    expect(result).toEqual(paginationResultbranchData());
    expect(service.findAllBranchs).toHaveBeenCalledWith(
      paginationOptions,
      '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    );
  });

  it('should find one branch', async () => {
    const result = await controller.findOneBranch(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    );
    expect(result).toEqual(branchData());
    expect(service.findOneBranch).toHaveBeenCalledWith(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    );
  });

  it('should return not found for non-existent branch', async () => {
    const result = await controller.findOneBranch('4567');
    expect(result).toEqual(findOneNotFoundReturnValue());
    expect(service.findOneBranch).toHaveBeenCalledWith('4567');
  });

  it('should update a branch', async () => {
    const updateBranchDto: UpdateBranchDto = updatebranchData();
    const req = { tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c' } as any;
    const result = await controller.updateBranch(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
      updateBranchDto,
      req,
    );
    expect(result).toEqual(updatebranchData());
    expect(service.updateBranch).toHaveBeenCalledWith(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
      updateBranchDto,
      '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    );
  });

  it('should remove a branch', async () => {
    const result = await controller.removeBranch(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    );
    expect(result).toEqual(deletebranchData());
    expect(service.removeBranch).toHaveBeenCalledWith(
      'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    );
  });
});
