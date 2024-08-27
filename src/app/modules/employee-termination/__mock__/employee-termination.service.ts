import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import {

  deleteEmployeeTerminationData,
  EmployeeTerminationData,
  findOneNotFoundReturnValue,
  paginationResultbranchData,
  updateEmployeeTerminationData,

} from '../tests/employee-termination.data';
import { CreateEmployeeTerminationDto } from '../dto/create-employee-termination.dto';
import { UpdateEmployeeTerminationDto } from '../dto/update-employee-termination.dto';
import { createbranchDataOnCreate } from '../../branchs/tests/branch.data';

export const BranchesService = jest.fn().mockReturnValue({
  createBranch: jest
    .fn()
    .mockImplementation((dto: CreateEmployeeTerminationDto, tenantId: string) => {
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
    return Promise.resolve(EmployeeTerminationData());
  }),
  updateBranch: jest
    .fn()
    .mockImplementation((id: string, dto: UpdateEmployeeTerminationDto) => {
      return Promise.resolve(updateEmployeeTerminationData());
    }),
  removeBranch: jest.fn().mockImplementation((id: string) => {
    return Promise.resolve(deleteEmployeeTerminationData());
  }),
});
