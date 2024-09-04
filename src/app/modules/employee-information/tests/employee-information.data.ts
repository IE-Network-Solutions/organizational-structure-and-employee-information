import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateEmployeeInformationDto } from '../dto/create-employee-information.dto';
import { EmployeeInformation } from '../entities/employee-information.entity';
import { Gender } from '@root/src/core/enum/gender.enum';
import { MaritalStatus } from '@root/src/core/enum/marital-status.enum';

// Employee Information Data
export const employeeInformationData = () => {
  return {
    id: '1234567890',
    gender: undefined,
    maritalStatus: undefined,
    dateOfBirth: new Date('1990-01-01'),
    joinedDate: '2020-01-01T00:00:00.000Z',
    nationalityId: 'nation-1',
    addresses: JSON.stringify({
      street: '456 Another St',
      city: 'Othertown',
      postalCode: '67890',
    }),
    emergencyContact: JSON.stringify({
      name: 'John Doe',
      phone: '098-765-4321',
    }),
    bankInformation: JSON.stringify({
      bankName: 'Sample Bank',
      accountNumber: '123456789',
    }),
    additionalInformation: JSON.stringify({
      hobbies: ['Reading', 'Traveling'],
    }),
    tenantId: undefined,
    userId: undefined,
    nationality: undefined,
    employeeDocument: undefined,
    user: undefined,
    createdAt: new Date('2024-01-01T12:00:00Z'),
    updatedAt: new Date('2024-01-01T12:00:00Z'),
    deletedAt: null,
  };
};

export const employeeInformationDataEnitty = (): EmployeeInformation => {
  return {
    id: '1234567890',
    gender: undefined,
    maritalStatus: undefined,
    dateOfBirth: new Date('1990-01-01'),
    joinedDate: new Date('2020-01-01T00:00:00.000Z'),
    nationalityId: 'nation-1',
    addresses: JSON.stringify({
      street: '456 Another St',
      city: 'Othertown',
      postalCode: '67890',
    }),
    emergencyContact: JSON.stringify({
      name: 'John Doe',
      phone: '098-765-4321',
    }),
    bankInformation: JSON.stringify({
      bankName: 'Sample Bank',
      accountNumber: '123456789',
    }),
    additionalInformation: JSON.stringify({
      hobbies: ['Reading', 'Traveling'],
    }),
    tenantId: undefined,
    userId: undefined,
    nationality: undefined,
    employeeDocument: undefined,
    user: undefined,
    createdAt: new Date('2024-01-01T12:00:00Z'),
    updatedAt: new Date('2024-01-01T12:00:00Z'),
    deletedAt: null,
  };
};

// Employee Information Data when Saved
export const employeeInformationDataSave = (): CreateEmployeeInformationDto => {
  return {
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    dateOfBirth: new Date('1990-01-01'),
    joinedDate: '2020-01-01T00:00:00.000Z',
    nationalityId: 'nation-1',
    addresses: JSON.stringify({
      street: '456 Another St',
      city: 'Othertown',
      postalCode: '67890',
    }),
    emergencyContact: JSON.stringify({
      name: 'John Doe',
      phone: '098-765-4321',
    }),
    bankInformation: JSON.stringify({
      bankName: 'Sample Bank',
      accountNumber: '123456789',
    }),
    additionalInformation: JSON.stringify({
      hobbies: ['Reading', 'Traveling'],
    }),
  };
};

// Create Data for Employee Information (if you have DTOs)
export const createEmployeeInformationData =
  (): CreateEmployeeInformationDto => ({
    gender: undefined,
    maritalStatus: undefined,
    dateOfBirth: new Date('1990-01-01'),
    joinedDate: '2020-01-01T00:00:00.000Z',
    nationalityId: 'nation-1',
    addresses: JSON.stringify({
      street: '456 Another St',
      city: 'Othertown',
      postalCode: '67890',
    }),
    emergencyContact: JSON.stringify({
      name: 'John Doe',
      phone: '098-765-4321',
    }),
    bankInformation: JSON.stringify({
      bankName: 'Sample Bank',
      accountNumber: '123456789',
    }),
    additionalInformation: JSON.stringify({
      hobbies: ['Reading', 'Traveling'],
    }),
  });

// Delete Result for Employee Information
export const deleteEmployeeInformationData = () => {
  return {
    raw: '',
    affected: 1,
    generatedMaps: [],
  };
};

// Pagination Result for Employee Information
export const paginationResultEmployeeInformationData =
  (): Pagination<EmployeeInformation> => {
    return {
      items: [employeeInformationDataEnitty()],
      meta: {
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
    };
  };

// Update Result for Employee Information
export const updateEmployeeInformationData = () => {
  return {
    raw: [],
    generatedMaps: [],
    affected: 1,
  };
};
