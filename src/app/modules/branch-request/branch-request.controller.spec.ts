import { Test, TestingModule } from '@nestjs/testing';
import { BranchRequestController } from './branch-request.controller';
import { BranchRequestService } from './branch-request.service';
import {
  branchRequestData,
  createbranchRequestData,
  paginationResultbranchRequestData,
} from './tests/branchRequest.data';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { UpdateBranchRequestDto } from './dto/update-branch-request.dto';

jest.mock('./branch-request.service.ts');

describe('BranchRequestController', () => {
  let branchRequestController: BranchRequestController;
  let branchRequestService: jest.Mocked<BranchRequestService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchRequestController],
      providers: [
        {
          provide: BranchRequestService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findAll_BasedOnUser: jest.fn(),
            findAllBranchRequestWithApprover: jest.fn(),
            findBranch: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    branchRequestController = module.get<BranchRequestController>(
      BranchRequestController,
    );
    branchRequestService = module.get<BranchRequestService>(
      BranchRequestService,
    ) as jest.Mocked<BranchRequestService>;

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call BranchRequestService.create with correct parameters', async () => {
      const mockTenantId = 'tenantId';
      const req = { tenantId: mockTenantId } as any;
      branchRequestService.create.mockResolvedValue(branchRequestData());

      const result = await branchRequestController.create(
        req,
        createbranchRequestData(),
      );

      expect(branchRequestService.create).toHaveBeenCalledWith(
        createbranchRequestData(),
        mockTenantId,
      );
      expect(result).toEqual(branchRequestData());
    });
  });

  describe('findAll', () => {
    it('should call BranchRequestService.findAll with correct parameters', async () => {
      const mockTenantId = 'tenantId';
      const req = { tenantId: mockTenantId } as any;
      const pagination = paginationOptions(); // Call the function to get PaginationDto
      branchRequestService.findAll.mockResolvedValue(
        paginationResultbranchRequestData(),
      );

      const result = await branchRequestController.findAll(req, pagination);

      expect(branchRequestService.findAll).toHaveBeenCalledWith(
        pagination,
        mockTenantId,
      );
      expect(result).toEqual(paginationResultbranchRequestData());
    });
  });

  describe('findAllBranchRequestWithApprover', () => {
    it('should call BranchRequestService.findAllBranchRequestWithApprover', async () => {
      const mockTenantId = 'tenantId';
      const req = { tenantId: mockTenantId } as any;
      const userId = 'user123';
      const pagination = paginationOptions();
      branchRequestService.findAllBranchRequestWithApprover.mockResolvedValue({
        items: [branchRequestData()],
        meta: {},
        links: {},
      });

      const result =
        await branchRequestController.findAllBranchRequestWithApprover(
          userId,
          req,
          pagination,
          req.tanantId,
        );

      expect(
        branchRequestService.findAllBranchRequestWithApprover,
      ).toHaveBeenCalledWith(pagination, mockTenantId, userId);
      expect(result).toEqual({
        items: [branchRequestData()],
        meta: {},
        links: {},
      });
    });
  });

  describe('findAll_BasedOnUser', () => {
    it('should call BranchRequestService.findAll_BasedOnUser', async () => {
      const userId = 'user123';
      const pagination = paginationOptions();
      branchRequestService.findAll_BasedOnUser.mockResolvedValue(
        paginationResultbranchRequestData(),
      );

      const result = await branchRequestController.findAll_BasedOnUser(
        userId,
        pagination,
      );

      expect(branchRequestService.findAll_BasedOnUser).toHaveBeenCalledWith(
        pagination,
        userId,
      );
      expect(result).toEqual(paginationResultbranchRequestData());
    });
  });

  describe('findBranch', () => {
    it('should call BranchRequestService.findBranch with correct id', async () => {
      const id = 'branch123';
      branchRequestService.findBranch.mockResolvedValue(branchRequestData());

      const result = await branchRequestController.findBranch(id);

      expect(branchRequestService.findBranch).toHaveBeenCalledWith(id);
      expect(result).toEqual(branchRequestData());
    });
  });

  describe('update', () => {
    it('should call BranchRequestService.update with correct parameters', async () => {
      const id = 'branch123';
      const updateDto: UpdateBranchRequestDto = { ...branchRequestData() };
      branchRequestService.update.mockResolvedValue(branchRequestData());

      const result = await branchRequestController.update(id, updateDto);

      expect(branchRequestService.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(branchRequestData());
    });
  });

  describe('remove', () => {
    it('should call BranchRequestService.remove with correct id', async () => {
      const id = 'branch123';
      branchRequestService.remove.mockResolvedValue(branchRequestData());

      const result = await branchRequestController.remove(id);

      expect(branchRequestService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(branchRequestData());
    });
  });
});
