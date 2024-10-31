import { tenantId } from "../../branchs/tests/branch.data";

export const rolePermissionData = () => {
  return {
    id: 'id',
    permissionId: ['1f980a35-bece-4d6e-aa9d-85e808bfdfcb'],
    roleId: 'bc80dfd2-1e02-4f3c-ad42-b39648ff2ecf',
    tenantId:"tenantId"
  };
};
export const rolePermissionDataSave = () => {
  return {
    permissionId: ['1f980a35-bece-4d6e-aa9d-85e808bfdfcb'],
    roleId: 'bc80dfd2-1e02-4f3c-ad42-b39648ff2ecf',
    role: null,
   tenantId:"tenantId",
    permissions: null,
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
  };
};

export const rolePermissionReturnedData = () => {
  return {
    id: 'id',
    permissionIds: ['1f980a35-bece-4d6e-aa9d-85e808bfdfcb'],
    roleId: 'bc80dfd2-1e02-4f3c-ad42-b39648ff2ecf',
     tenantId:"tenantId",
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
    role: null,
    permissions: null,
  };
};

export const createRolePermissionData = () => {
  return {
    permissionId: ['1f980a35-bece-4d6e-aa9d-85e808bfdfcb'],
    roleId: 'bc80dfd2-1e02-4f3c-ad42-b39648ff2ecf',
     tenantId:"tenantId"
  };
};

export const createRolePermissionDataForRolePermission = () => {
  return {
    permission: {
      id: '1f980a35-bece-4d6e-aa9d-85e808bfdfcb',
    },
    role: { id: 'bc80dfd2-1e02-4f3c-ad42-b39648ff2ecf' },
  };
};

export const paginationResultRolePermissionData = () => {
  return {
    items: [rolePermissionDataSave()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

export const updateRolePermissionData = () => {
  return {
    raw: [],
    generatedMaps: [],
    affected: 1,
  };
};

export const deleteRolePermissionData = () => {
  return {
    raw: [],
    affected: 1,
    generatedMaps: [],
  };
};
