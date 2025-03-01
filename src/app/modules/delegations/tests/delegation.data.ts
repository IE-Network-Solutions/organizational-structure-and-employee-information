import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateDelegationDto } from '../dto/create-delegation.dto';
import { Delegation } from '../entities/delegation.entity';

export const delegationData = (): Delegation => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    userId: 'c3e2f9a1-13f2-4e1d-9b3a-55a16a0b2541',
    leaveTypeId: 'd4f7b2a5-6e9b-4b30-913f-8123a2cceee4',
    delegatorId: 'a8b3f92c-37f7-4b1c-b8e3-529d8d09adf5',
    delegateeId: 'b5d7f842-817d-46c2-b5fd-05c4a1e6a957',
    leaveRequestId: 'b5d7f842-817d-46c2-b5fd-05c4a1e6a957',
    startDate: new Date('2022-10-22T07:11:42Z'),
    endDate: new Date('2022-10-25T07:11:42Z'),
    status: true,
    reason: 'Annual leave delegation',
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    updatedAt: new Date('2022-10-22T07:11:42Z'),
    createdAt: new Date('2022-10-22T07:11:42Z'),
    delegatee:null,
    delegator:null,
    user:null,
  };
};

export const createDelegationData = (): CreateDelegationDto => {
  return {
    userId: 'c3e2f9a1-13f2-4e1d-9b3a-55a16a0b2541',
    leaveTypeId: 'd4f7b2a5-6e9b-4b30-913f-8123a2cceee4',
    delegatorId: 'a8b3f92c-37f7-4b1c-b8e3-529d8d09adf5',
    delegateeId: 'b5d7f842-817d-46c2-b5fd-05c4a1e6a957',
    startDate: new Date('2022-10-22T07:11:42Z'),
    endDate: new Date('2022-10-25T07:11:42Z'),
    status: false,
    reason: 'Covering for a sick colleague',
    leaveRequestId:'b5d7f842-817d-46c2-b5fd-05c4a1e6a957',
  };
};

export const deleteDelegationData = () => {
  return {
    raw: '',
    affected: 1,
    generatedMaps: [],
  };
};

export const updateDelegationDataReturned = () => {
  return {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };
};

export const paginationResultDelegationData = (): Pagination<Delegation> => {
  return {
    items: [delegationData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

export const updateDelegationData = () => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    userId: 'c3e2f9a1-13f2-4e1d-9b3a-55a16a0b2541',
    leaveTypeId: 'd4f7b2a5-6e9b-4b30-913f-8123a2cceee4',
    delegatorId: 'a8b3f92c-37f7-4b1c-b8e3-529d8d09adf5',
    delegateeId: 'b5d7f842-817d-46c2-b5fd-05c4a1e6a957',
    startDate: new Date('2022-10-22T07:11:42Z'),
    endDate: new Date('2022-10-26T07:11:42Z'),
    status: true,
    reason: 'Extended delegation period',
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
  };
};

export const createDelegationDataOnCreate = () => {
  return {
    userId: 'c3e2f9a1-13f2-4e1d-9b3a-55a16a0b2541',
    leaveTypeId: 'd4f7b2a5-6e9b-4b30-913f-8123a2cceee4',
    delegatorId: 'a8b3f92c-37f7-4b1c-b8e3-529d8d09adf5',
    delegateeId: 'b5d7f842-817d-46c2-b5fd-05c4a1e6a957',
    startDate: new Date('2022-10-22T07:11:42Z'),
    endDate: new Date('2022-10-25T07:11:42Z'),
    status: false,
    reason: 'Urgent business trip replacement',
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
  };
};

export const findOneNotFoundReturnValue = () => {
  return {
    statusCode: 404,
    message: 'Delegation with Id 4567 not found',
    error: 'Not Found',
  };
};
