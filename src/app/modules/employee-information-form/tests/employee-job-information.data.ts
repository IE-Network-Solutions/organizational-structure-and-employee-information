// employee-information-form.data.ts

import { Pagination } from 'nestjs-typeorm-paginate';
import { EmployeeInformationForm } from '../entities/employee-information-form.entity';

export const employeeInformationFormData = (): EmployeeInformationForm => ({
  id: '1234567890',
  formTitle: 'Employee Details',
  form: [
    { id: '1', fieldName: 'First Name', fieldType: 'text', isActive: true },
    { id: '2', fieldName: 'Last Name', fieldType: 'text', isActive: true },
    { id: '3', fieldName: 'Date of Birth', fieldType: 'date', isActive: false },
  ],
  tenantId: 'tenant-1',
  createdAt: new Date('2023-01-01T06:00:00.000Z'),
  updatedAt: new Date('2023-01-01T06:00:00.000Z'),
  deletedAt: null,
});

export const createEmployeeInformationForm =
  (): Partial<EmployeeInformationForm> => ({
    formTitle: 'Employee Details',
    form: [
      { id: '1', fieldName: 'First Name', fieldType: 'text', isActive: true },
      { id: '2', fieldName: 'Last Name', fieldType: 'text', isActive: true },
      {
        id: '3',
        fieldName: 'Date of Birth',
        fieldType: 'date',
        isActive: false,
      },
    ],
    tenantId: 'tenant-1',
  });

export const paginatedEmployeeInformationForms =
  (): Pagination<EmployeeInformationForm> => ({
    items: [employeeInformationFormData()],
    meta: {
      itemCount: 2,
      totalItems: 2,
      itemsPerPage: 1,
      totalPages: 2,
      currentPage: 1,
    },
  });
export const updateEmployeeInformationFormData =
  (): Partial<EmployeeInformationForm> => ({
    formTitle: 'Updated Employee Details',
    form: [
      { id: '1', fieldName: 'First Name', fieldType: 'text', isActive: true },
      { id: '2', fieldName: 'Last Name', fieldType: 'text', isActive: true },
      {
        id: '3',
        fieldName: 'Date of Birth',
        fieldType: 'date',
        isActive: true,
      },
    ],
    tenantId: 'tenant-1',
  });

export const deleteEmployeeInformationFormData =
  (): EmployeeInformationForm => ({
    id: '1234567890',
    formTitle: 'Employee Details',
    form: [
      { id: '1', fieldName: 'First Name', fieldType: 'text', isActive: true },
      { id: '2', fieldName: 'Last Name', fieldType: 'text', isActive: true },
      {
        id: '3',
        fieldName: 'Date of Birth',
        fieldType: 'date',
        isActive: false,
      },
    ],
    tenantId: 'tenant-1',
    createdAt: new Date('2023-01-01T06:00:00.000Z'),
    updatedAt: new Date('2023-01-01T06:00:00.000Z'),
    deletedAt: new Date('2023-01-01T06:00:00.000Z'), // Mark as deleted
  });
