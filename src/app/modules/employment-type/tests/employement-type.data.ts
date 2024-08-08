// employment-type.data.ts

import { EmployementType } from '../entities/employement-type.entity';

// Mock data for a single EmploymentType
export const employementTypeData = (): EmployementType => {
    return {
        id: 'employment-type-1',
        name: 'Full-Time',
        employeeJobInformation: undefined,
        tenantId: 'tenant-123',
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-01T12:00:00Z'),
        deletedAt: null,
    };
};

// Mock data for creating a new EmploymentType
export const createEmployementTypeData = () => {
    return {
        name: 'Part-Time',
        tenantId: 'tenant-456',
    };
};

// Mock data for an EmploymentType as it might appear after saving to the database
export const employmentTypeDataSaved = (): EmployementType => {
    return {
        id: 'employment-type-2',
        name: 'Part-Time',
        employeeJobInformation: undefined,
        tenantId: 'tenant-456',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    };
};

// Mock data for EmploymentType when finding a specific record
export const employmentTypeDataOnFindOne = (): EmployementType => {
    return {
        id: 'employment-type-1',
        name: 'Full-Time',
        employeeJobInformation: undefined,
        tenantId: 'tenant-123',
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-01T12:00:00Z'),
        deletedAt: null,
    };
};

// Mock data for deleting an EmploymentType
export const deleteEmploymentTypeData = () => {
    return {
        raw: '',
        affected: 1,
        generatedMaps: [],
    };
};

// Mock data for paginated results of EmploymentType
export const paginationResultEmploymentTypeData = () => {
    return {
        items: [employementTypeData()],
        meta: {
            totalItems: 1,
            itemCount: 1,
            itemsPerPage: 10,
        }
    }
}
export const updateUserData = () => {
    return {
        raw: [],
        generatedMaps: [],
        affected: 1,
    };
};

export const deleteUserData = () => {
    return {
        raw: [],
        affected: 1,
        generatedMaps: [],
    };
};
