import { NotFoundException } from '@nestjs/common';
import { employeeDocumentData, paginationResultEmployeeDocumentData } from '../tests/employee-documents.data';

// import { paginationResultUserData, userData } from '../tests/user.data';

export const EmployeeDocumentsService = jest.fn().mockReturnValue({
    create: jest.fn().mockResolvedValue(employeeDocumentData()),
    findAll: jest.fn().mockResolvedValue(paginationResultEmployeeDocumentData()),
    findOne: jest
        .fn()
        .mockImplementation((id) =>
            id === employeeDocumentData().id
                ? Promise.resolve(employeeDocumentData())
                : Promise.reject(new NotFoundException()),
        ),

    update: jest
        .fn()
        .mockImplementation((id) =>
            id === employeeDocumentData().id
                ? Promise.resolve(employeeDocumentData())
                : Promise.reject(new Error(`employeeDocument with id ${id} not found.`)),
        ),

    remove: jest
        .fn()
        .mockImplementation((id) =>
            id === employeeDocumentData().id
                ? Promise.resolve('Promise resolves with void')
                : Promise.reject(new Error(`employeeDocument with id ${id} not found.`)),
        ),
});
