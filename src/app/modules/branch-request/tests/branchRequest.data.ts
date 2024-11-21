import { Pagination } from 'nestjs-typeorm-paginate';
import { BranchRequestStatus } from '../enum/Branch-request-status.enum'; // Assuming the enum is imported from the correct location
import { BranchRequest } from '../entities/branch-request.entity';
import { CreateBranchRequestDto } from '../dto/create-branch-request.dto';
import { Branch } from '../../branchs/entities/branch.entity'; // Importing Branch entity for relation

export const branchRequestData = (): BranchRequest => {
  const currentBranch: Branch = {
    id: 'branch-id-1',
    name: 'Current Branch',
    description: 'Description of the current branch',
    location: 'Location of the current branch',
    contactNumber: '1234567890',
    contactEmail: 'current@branch.com',
    tenantId: 'tenant-id-1',
    departments: [],
    employeeJobInformation: null,
    currentRequests: [],
    requestedRequests: [],
    createdAt: new Date('2024-11-21T06:13:40.957Z'),
    updatedAt: new Date('2024-11-21T06:13:40.957Z'),
  };

  const requestBranch: Branch = {
    id: 'branch-id-2',
    name: 'Request Branch',
    description: 'Description of the request branch',
    location: 'Location of the request branch',
    contactNumber: '0987654321',
    contactEmail: 'request@branch.com',
    tenantId: 'tenant-id-2',
    departments: [],
    employeeJobInformation: null,
    currentRequests: [],
    requestedRequests: [],
    createdAt: new Date('2024-11-21T06:13:40.957Z'),
    updatedAt: new Date('2024-11-21T06:13:40.957Z'),
  };

  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    userId: 'hq',
    currentBranch,
    requestBranch,
    currentBranchId: currentBranch.id,
    requestBranchId: requestBranch.id,
    approvalType: '34567890',
    status: BranchRequestStatus.PENDING,
    approvalWorkflowId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    tenantId: null,
    updatedAt: new Date('2022-10-22T07:11:42.000Z'),
    createdAt: new Date('2022-10-22T07:11:42.000Z'),
  };
};

export const createbranchRequestData = (): CreateBranchRequestDto => {
  return {
    userId: 'ndcijwebfi583498bnfdiu983r98',
    currentBranchId: 'branch-id-1',
    requestBranchId: 'branch-id-2',
    approvalType: '34567890',
    status: BranchRequestStatus.PENDING,
    approvalWorkflowId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    tenantId: null,
  };
};

export const deletebranchRequestData = () => {
  return {
    raw: '',
    affected: 1,
    generatedMaps: [],
  };
};

export const UpdatebranchRequestDataReturned = () => {
  return {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };
};

export const paginationResultbranchRequestData =
  (): Pagination<BranchRequest> => {
    return {
      items: [branchRequestData()],
      meta: {
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
    };
  };

export const updatebranchRequestData = () => {
  return {
    currentBranchId: 'branch-id-1',
    requestBranchId: 'branch-id-2',
    approvalType: '34567890',
    status: BranchRequestStatus.PENDING,
    approvalWorkflowId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    tenantId: null,
  };
};

export const createbranchRequestDataOnCreate = (): CreateBranchRequestDto => {
  return {
    userId: 'ndcijwebfi583498bnfdiu983r98',
    currentBranchId: 'branch-id-1',
    requestBranchId: 'branch-id-2',
    approvalType: '34567890',
    status: BranchRequestStatus.PENDING,
    approvalWorkflowId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    tenantId: null,
  };
};

export const createbranchRequestDataOnSave = () => {
  return {
    currentBranch: 'branch-id-1',
    requestBranch: 'branch-id-2',
    approvalType: '34567890',
    status: BranchRequestStatus.PENDING,
    approvalWorkflowId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    tenantId: null,
  };
};

export const findOneNotFoundReturnValue = () => {
  return {
    statusCode: 404,
    message: 'BranchRequest with Id 4567 not found',
    error: 'Not Found',
  };
};

export const tenantId = () => {
  return {
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
  };
};
