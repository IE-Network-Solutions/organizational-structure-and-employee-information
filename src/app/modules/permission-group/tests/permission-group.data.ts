import { CreatePermissionGroupDto } from '../dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from '../dto/update-permission-group.dto';
import { PermissionGroup } from '../entities/permission-group.entity';

export const permissionGroupData = () => {
  return {
    id: '1',
    name: 'Group One',
    description: 'This is description for Group one',
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
    tenantId: '1',
    permission: [],
  };
};

export const createPermissionGroup = (): CreatePermissionGroupDto => {
  return {
    name: 'Group One',
    description: 'This is for Group one description',
    permissions: [],
    tenantId: 'tenantId',
  };
};

export const updatePermissionGroupData = (): UpdatePermissionGroupDto => {
  return {
    name: 'Group One',
    description: 'This is for Group one description',
    permissions: [],
    tenantId: 'tenantId',
  };
};

export const findAllPermissionGroups = () => {
  return {
    items: [permissionGroupData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

export const updatePermissionGroup = () => {
  return {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };
};

export const deletepermissionGroup = () => {
  return {
    raw: [],
    affected: 1,
    generatedMaps: [],
  };
};
