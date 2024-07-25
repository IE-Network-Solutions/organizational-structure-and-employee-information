import { Pagination } from 'nestjs-typeorm-paginate';
import { CreatePermissionDto } from '../dto/create-permission.dto';

export const permissionData = () => {
  return {
    id: '1',
    name: 'Create permission',
    slug: 'create_permission',
    description: 'Description for create permission',
    permissionGroupId: "permissionGroupId",
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
  };
};

export const createPermission = () => {
  return {
    name: 'Create permission',
    slug: 'create_permission',
    description: 'Description for create permission',
    permissionGroupId: "permissionGroupId"
  };
};

export const findAllPermissions = (): Pagination<CreatePermissionDto> => {
  return {
    items: [permissionData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

export const updatePermission = () => {
  return {
    raw: [],
    generatedMaps: [],
    affected: 1,
  };
};

export const deletePermission = () => {
  return {
    raw: [],
    affected: 1,
    generatedMaps: [],
  };
};
