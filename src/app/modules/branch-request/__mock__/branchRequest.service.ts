import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { CreateBranchRequestDto } from '../dto/create-branch-request.dto';
import {
  createbranchRequestData,
  deletebranchRequestData,
  paginationResultbranchRequestData,
  updatebranchRequestData,
  branchRequestData,
} from '../tests/branchRequest.data';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { UpdateBranchRequestDto } from '../dto/update-branch-request.dto';
import { BranchRequest } from '../entities/branch-request.entity';

export const BranchRequestService = jest.fn().mockReturnValue({
  // Mock for creating a branch request
  create: jest
    .fn()
    .mockImplementation((dto: CreateBranchRequestDto, tenantId: string) =>
      Promise.resolve(createbranchRequestData()),
    ),

  // Mock for finding all branch requests with pagination
  findAll: jest
    .fn()
    .mockImplementation((paginationOptions: PaginationDto, tenantId: string) =>
      Promise.resolve(paginationResultbranchRequestData()),
    ),

  // Mock for finding all branch requests with approvers
  findAllBranchRequestWithApprover: jest
    .fn()
    .mockImplementation(
      (paginationOptions: PaginationDto, tenantId: string, userId: string) =>
        Promise.resolve(paginationResultbranchRequestData()),
    ),

  // Mock for finding branch requests by user ID
  findAll_BasedOnUser: jest
    .fn()
    .mockImplementation((paginationOptions: PaginationDto, userId: string) =>
      Promise.resolve(paginationResultbranchRequestData()),
    ),

  // Mock for finding a single branch request by ID
  findBranch: jest.fn().mockImplementation((id: string) => {
    if (id === 'branch-id-1') {
      return Promise.resolve(branchRequestData());
    }
    return Promise.resolve(null); // Simulate not found scenario
  }),

  // Mock for updating a branch request
  update: jest
    .fn()
    .mockImplementation((id: string, dto: UpdateBranchRequestDto) =>
      Promise.resolve(updatebranchRequestData()),
    ),

  // Mock for removing a branch request
  remove: jest.fn().mockImplementation((id: string) => {
    return Promise.resolve(deletebranchRequestData());
  }),
});
