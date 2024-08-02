export const userPermissionData = () => {
  return {
    id: 'id',
    permissionIds: ['permissionId'],
    userId: 'userId',
  };
};
export const userPermissionDataSave = () => {
  return {
    id: 'id',
    permissionIds: ['permissionId'],
    userId: 'userId',
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
    user: null,
    permission: null,
  };
};

export const createUserPermissionData = () => {
  return {
    permissionId: ['permissionId'],
    userId: 'userId',
  };
};

export const createUserPermission = () => {
  return {
    permission: { id: 'permissionId' },

    user: { id: 'userId' },
  };
};

export const paginationResultUserPermissionData = () => {
  return {
    items: [userPermissionData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

export const updateUserPermissionData = () => {
  return {
    raw: [],
    generatedMaps: [],
    affected: 1,
  };
};

export const deleteUserPermissionData = () => {
  return {
    raw: [],
    affected: 1,
    generatedMaps: [],
  };
};
