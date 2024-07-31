import { Pagination } from 'nestjs-typeorm-paginate';
import { Branch } from '../../branchs/entities/branch.entity';
import { CreateBranchDto } from '../../branchs/dto/create-branch.dto';




export const branchData = (): Branch => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    name: "hq",
    description: "hq",
    location: "addis ababa",
    contactNumber: "34567890",
    contactEmail: "s@s.com",
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    departments: null,
    updatedAt: new Date('2022-10-22 07:11:42'),
    createdAt: new Date('2022-10-22 07:11:42'),
  };
};

export const createbranchData = (): CreateBranchDto => {
  return {

    name: "hq",
    description: "hq",
    location: "addis ababa",
    contactNumber: "34567890",
    contactEmail: "s@s.com",




    //   tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
  };
};
export const deletebranchData = () => {
  return {
    raw: '',
    affected: 1,
    generatedMaps: [],
  };
};

export const UpdatebranchDataReturned = () => {
  return {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };
};

export const paginationResultbranchData = (): Pagination<Branch> => {
  return {
    items: [branchData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

export const updatebranchData = () => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    name: "hq",
    description: "hq",
    location: "addis ababa",
    contactNumber: "34567890",
    contactEmail: "s@s.com",
  };
};
export const createbranchDataOnCreate = () => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    name: "hq",
    description: "hq",
    location: "addis ababa",
    contactNumber: "34567890",
    contactEmail: "s@s.com",

  };
};

export const findOneNotFoundReturnValue = () => {
  return {
    statusCode: 404,
    message: 'Branch with Id 4567 not found',
    error: 'Not Found',
  };
};
