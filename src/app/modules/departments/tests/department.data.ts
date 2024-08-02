import { Pagination } from 'nestjs-typeorm-paginate';

import { Department } from '../entities/department.entity';
import { CreateDepartmentDto } from '../dto/create-department.dto';

export const departmentData = (): Department => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    name: 'New Department',
    description: 'New Department Description',
    branchId: '1',
    tenantId: 'tenant1',
    level: 0,
    department: null, // Fixed typo
    parent: null,
    createdAt: new Date('2022-10-22T04:11:42.000Z'),
    updatedAt: new Date('2022-10-22T04:11:42.000Z'),
    branch: null,
    employeeJobInformation: null
  };
};

export const departmentsData = () => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    name: 'New Department',
    description: 'New Department Description',
    branchId: '1',
    tenantId: 'tenant1',
    level: 0,
    department: [],
    parent: null,
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
    branch: null,
  };
};

export const createdepartmentData = (): CreateDepartmentDto => {
  return {
    name: 'New Department',
    description: 'New Department Description',
    branchId: '1',
    department: [],
  };
};

export const createdepartmentDataOnCreate = () => {
  return {
    ...createdepartmentData(),
    tenantId: 'tenant1',
    level: 0,
  };
};

export const updatedepartmentData = () => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    name: 'Updated Department',
    description: 'Updated Description',
    branchId: '1',
    tenantId: 'tenant1',
    department: null,
    parent: null,
    level: 0,
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
    branch: null,
  };
};

export const paginationResultdepartmentData = (): Pagination<Department> => {
  return {
    items: [departmentData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

export const findOneNotFoundReturnValue = () => {
  return {
    statusCode: 404,
    message: 'Department with Id 4567 not found',
    error: 'Not Found',
  };
};
