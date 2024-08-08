export const rolePermissionData = () => {
  return {
    id: 'id',
    permissionIds: 'permissionId',
    roleId: 'roleId',
  };
};
export const rolePermissionDataSave = () => {
  return {
    permissionIds: 'permissionId',
    roleId: 'roleId',
    role: null,
    permissions: null,
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
  };
};

export const rolePermissionReturnedData = () => {
  return {
    id: 'id',
    permissionIds: 'permissionId',
    roleId: 'roleId',
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
    role: null,
    permissions: null,
  };
};

export const createRolePermissionData = () => {
  return {
    permissionId: ['permissionId'],
    roleId: 'roleId',
  };
};
export const createRolePermissionDataForRolePermission = () => {
  return {
    permission: {
      id: 'permissionId',
    },
    role: { id: 'roleId' },
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
