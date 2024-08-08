import { Pagination } from 'nestjs-typeorm-paginate';
import { EmployeeDocument } from '../entities/employee-documents.entity';

// Employee Document Data
export const employeeDocumentData = () => {
    return {
        id: 'document-1',
        userId: 'user-1',
        documentName: 'Employee Handbook',
        documentLink: 'http://example.com/documents/employee-handbook.pdf',
        createdAt: new Date('2023-01-01 00:00:00'),
        updatedAt: new Date('2023-01-01 00:00:00'),
        deletedAt: null,
        user: null
    }
};

// Employee Document Data when Saved
export const employeeDocumentDataSave = () => {
    return {
        id: 'document-1',
        userId: 'user-1',
        documentName: 'Employee Handbook',
        documentLink: 'http://example.com/documents/employee-handbook.pdf',
        createdAt: new Date('2023-01-01 00:00:00'),
        updatedAt: new Date('2023-01-01 00:00:00'),
        deletedAt: null,
    }
};

// Employee Document Data on FindOne
export const employeeDocumentDataOnFindOne = () => {
    return {
        id: 'document-1',
        userId: 'user-1',
        documentName: 'Employee Handbook',
        documentLink: 'http://example.com/documents/employee-handbook.pdf',
        createdAt: new Date('2023-01-01 00:00:00'),
        updatedAt: new Date('2023-01-01 00:00:00'),
        deletedAt: null,
    }
};

// Create Data for Employee Document (if you have DTOs)
export const createEmployeeDocumentData = () => ({
    documentName: 'Employee Handbook',
    documentLink: 'http://example.com/documents/employee-handbook.pdf',
});

// Pagination Result for Employee Documents
export const paginationResultEmployeeDocumentData = (): Pagination<EmployeeDocument> => ({
    items: [employeeDocumentData()],
    meta: {
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
    },
});

// Update Result for Employee Document
export const updateEmployeeDocumentData = () => ({
    raw: [],
    generatedMaps: [],
    affected: 1,
});

// Delete Result for Employee Document
export const deleteEmployeeDocumentData = () => ({
    raw: [],
    affected: 1,
    generatedMaps: [],
});
