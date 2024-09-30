import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

export const userData = () => {
  return {
    id: '1',
    firstName: 'John',
    middleName: 'H',
    lastName: 'Doe',
    profileImage: 'profile_image_url',
    profileImageDownload: 'profile_image_download_url',
    email: 'hiluf@gmail.com',
    roleId: 'role-id-123',
    tenantId: 'tenant-id-123',
    createdAt: new Date('2022-10-22T07:11:42Z'),
    updatedAt: new Date('2022-10-22T07:11:42Z'),
    role: null, // Adjust based on actual role data
    userPermissions: [], // Adjust based on actual permissions
    employeeJobInformation: [],
    employeeDocument: undefined,
    employeeInformation: undefined,
    firebaseId: 'gh',
    permission: [],
  };
};

// User Data for Save Operation
export const userDataSave = () => {
  return {
    id: '1',
    firstName: 'John',
    middleName: 'H',
    lastName: 'Doe',
    profileImage: 'profile_image_url',
    profileImageDownload: 'profile_image_download_url',
    email: 's@s.com',
    roleId: '1',
    tenantId: 'tenant-id-123',
    contactInformation: JSON.stringify({
      phone: '123-456-7890',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        postalCode: '12345',
      },
    }),
    createdAt: new Date('2022-10-22T07:11:42Z'),
    updatedAt: new Date('2022-10-22T07:11:42Z'),
    role: null,
    userPermissions: [],
  };
};

// User Data for FindOne Operation
export const userDataOnFindOne = () => {
  return {
    id: '1',
    firstName: 'John',
    middleName: 'H',
    lastName: 'Doe',
    profileImage: 'profile_image_url',
    profileImageDownload: 'profile_image_download_url',
    email: 's@s.com',
    roleId: '1',
    tenantId: 'tenant-id-123',
    contactInformation: JSON.stringify({
      phone: '123-456-7890',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        postalCode: '12345',
      },
    }),
    createdAt: new Date('2022-10-22T07:11:42Z'),
    updatedAt: new Date('2022-10-22T07:11:42Z'),
    role: null,
    userPermissions: [],
    permissions: [],
  };
};

// Data for Creating a User
export const createUserData = () => {
  return {
    firstName: 'John',
    middleName: 'H',
    lastName: 'Doe',
    email: 's@s.com',
    roleId: '1',
    tenantId: 'tenant-id-123',
    contactInformation: JSON.stringify({
      phone: '123-456-7890',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        postalCode: '12345',
      },
    }),
  };
};

// Data for Delete Operation
export const deleteUserData = () => {
  return {
    raw: '',
    affected: 1,
    generatedMaps: [],
  };
};

// Pagination Result for Users
export const paginationResultUserData = (): Pagination<CreateUserDto> => {
  return {
    items: [userData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

// Data for Update Operation
export const updateUserData = () => {
  return {
    raw: [],
    generatedMaps: [],
    affected: 1,
  };
};

// Data for Delete Operation (Alternate)
export const deleteUserDataAlternate = () => {
  return {
    raw: [],
    affected: 1,
    generatedMaps: [],
  };
};
export const filterDto = () => {
  return {};
};

export const mockUsers = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    middleName: 'Alice',
    Avatar:
      'https://files.ienetworks.co/view/test/9fdb9540-607e-4cc5-aebf-0879400d1f69/cat.jpg',
    employeeJobInformation: [
      {
        department: {
          id: '3ca1e26f-c7bb-4a9a-9898-cbdfd752c52a',
          createdAt: '2024-08-02T07:13:50.111Z',
          updatedAt: '2024-08-14T12:54:50.208Z',
          deletedAt: null,
          createdBy: null,
          updatedBy: null,
          name: 'Hr',
          description: 'Handles specific operations',
          branchId: '19223038-d73b-4fe6-95fd-4c4793c4ba2e',
          tenantId: '9fdb9540-607e-4cc5-aebf-0879400d1f69',
          level: 0,
        },
      },
    ],
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob@example.com',
    middleName: 'Alice',
    Avatar:
      'https://files.ienetworks.co/view/test/9fdb9540-607e-4cc5-aebf-0879400d1f69/cat.jpg',
    employeeJobInformation: [
      {
        department: {
          id: '3ca1e26f-c7bb-4a9a-9898-cbdfd752c52a',
          createdAt: '2024-08-02T07:13:50.111Z',
          updatedAt: '2024-08-14T12:54:50.208Z',
          deletedAt: null,
          createdBy: null,
          updatedBy: null,
          name: 'Hr',
          description: 'Handles specific operations',
          branchId: '19223038-d73b-4fe6-95fd-4c4793c4ba2e',
          tenantId: '9fdb9540-607e-4cc5-aebf-0879400d1f69',
          level: 0,
        },
      },
    ],
  },
];
