import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateRoleDto } from '../dto/create-role.dto';

export const roleData = () => {
  return {
    id: '1',
    name: 'Admin role',
    description: 'Description for admin role',
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
    permission: ['List of permission ids'],
  };
};
export const roleDataSave = () => {
  return {
    id: '1',
    name: 'Admin role',
    description: 'Description for admin role',
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
    user: [],
    rolePermissions: [],
  };
};

export const createRole = (): CreateRoleDto => {
  return {
    name: 'Admin role',
    description: 'Description for admin role',
    permission: ['List of permission ids'],
  };
};

export const findAllRoles = (): Pagination<CreateRoleDto> => {
  return {
    items: [roleData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

export const updateRoleData = () => {
  return {
    raw: [],
    generatedMaps: [],
    affected: 1,
  };
};

export const deleteRoleData = () => {
  return {
    raw: [],
    affected: 1,
    generatedMaps: [],
  };
};
