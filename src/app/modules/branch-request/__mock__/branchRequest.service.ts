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
  create: jest
    .fn()
    .mockImplementation((dto: CreateBranchRequestDto, tenantId: string) =>
      Promise.resolve(createbranchRequestData()),
    ),

  findAll: jest
    .fn()
    .mockImplementation((paginationOptions: PaginationDto, tenantId: string) =>
      Promise.resolve(paginationResultbranchRequestData()),
    ),

  findAllBranchRequestWithApprover: jest
    .fn()
    .mockImplementation(
      (paginationOptions: PaginationDto, tenantId: string, userId: string) =>
        Promise.resolve(paginationResultbranchRequestData()),
    ),

  findAll_BasedOnUser: jest
    .fn()
    .mockImplementation((paginationOptions: PaginationDto, userId: string) =>
      Promise.resolve(paginationResultbranchRequestData()),
    ),

  findBranch: jest.fn().mockImplementation((id: string) => {
    if (id === 'branch-id-1') {
      return Promise.resolve(branchRequestData());
    }
    return Promise.resolve(null);
  }),

  update: jest
    .fn()
    .mockImplementation((id: string, dto: UpdateBranchRequestDto) =>
      Promise.resolve(updatebranchRequestData()),
    ),

  remove: jest.fn().mockImplementation((id: string) => {
    return Promise.resolve(deletebranchRequestData());
  }),
});
