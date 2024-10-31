import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateRoleDto } from '../dto/create-role.dto';

export const roleData = () => {
  return {
    id: '1',
    name: 'Admin role',
    description: 'Description for admin role',
    rolePermissions: [],
    tenantId: 'tenantId',
    slug: 'slug',
    user: [],
    permission: [],
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
    deletedAt: new Date('2022-10-22 07:11:42'),
  };
};
export const roleDataSave = (): CreateRoleDto => {
  return {
    name: 'Admin role',
    description: 'Description for admin role',
    // slug: 'slug',
    permission: [],
    tenantId: 'tenantId',
  };
};

export const createRole = (): CreateRoleDto => {
  return {
    name: 'Admin role',
    //slug: 'slug',
    description: 'Description for admin role',
    permission: ['List of permission ids'],
    tenantId: 'tenantId',
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

export const updateRole = () => {
  return {
    raw: [],
    generatedMaps: [],
    affected: 1,
  };
};

export const deleteRole = () => {
  return {
    raw: [],
    affected: 1,
    generatedMaps: [],
  };
};
