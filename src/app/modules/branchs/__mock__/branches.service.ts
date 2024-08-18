import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { CreateBranchDto } from '../dto/create-branch.dto';
import {
  branchData,
  createbranchDataOnCreate,
  deletebranchData,
  findOneNotFoundReturnValue,
  paginationResultbranchData,
  updatebranchData,
} from '../tests/branch.data';
import { UpdateBranchDto } from '../dto/update-branch.dto';

export const BranchesService = jest.fn().mockReturnValue({
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
});
