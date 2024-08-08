import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

export const userData = (): User => {
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
        employeeJobInformation: undefined,
        employeeDocument: undefined,
        employeeInformation: undefined
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
