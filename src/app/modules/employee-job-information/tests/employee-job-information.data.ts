import { EmployementContractType } from '@root/src/core/enum/employement-contract-type.enum';
import { EmployeeJobInformation } from '../entities/employee-job-information.entity';
import { JobPosition } from '@root/src/app/modules/job-position/entities/job-position.entity';
import { JobAction } from '../enum/job-action.enum';

export const employeeJobInformationData = (): EmployeeJobInformation => {
  return {
    id: 'a7c8a8b3-1f4a-4f91-a8d2-5f2a9a1b8d2c',
    positionId: 'Software Engineer',
    userId: '1',
    branchId: '1',
    isPositionActive: true,
    effectiveStartDate: new Date('2023-01-01'),
    effectiveEndDate: new Date('2024-01-01'),
    employementTypeId: '1',
    departmentId: '1',
    jobAction: JobAction.promotion,
    departmentLeadOrNot: false,
    employmentContractType: EmployementContractType.CONTRACTUAL,
    workScheduleId: '1',
    employeeTermination: undefined,
    tenantId: '1',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),

    // Mocks for relationships
    user: { id: '1', name: 'John Doe', email: 'john.doe@example.com' } as any, // mock as needed
    branch: { id: '1', name: 'Main Branch' } as any, // mock as needed
    employementType: { id: '1', name: 'Full-Time' } as any, // mock as needed
    department: { id: '1', name: 'Engineering' } as any, // mock as needed
    workSchedule: { id: '1', name: '9-5' } as any, // mock as needed
    position: { id: '1', name: 'Software Engineer' } as JobPosition,
  };
};

export const employeeJobInformationDataSave = () => {
  return {
    branch: null,
    branchId: '1',
    createdAt: new Date('2023-01-01T06:00:00.000Z'),
    department: null,
    departmentId: '1',
    departmentLeadOrNot: false,
    effectiveEndDate: new Date('2024-01-01T06:00:00.000Z'),
    effectiveStartDate: new Date('2023-01-01T06:00:00.000Z'),
    employmentContractType: 'Contractual',
    employmentType: null,
    employmentTypeId: '1',
    isPositionActive: true,
    PositionId: 'Software Engineer',
    tenantId: '1',
    updatedAt: new Date('2023-01-01T06:00:00.000Z'),
    user: null,
    userId: '1',
    workSchedule: null,
    workScheduleId: '1',
  };
};

export const deleteEmployeeJobInformationData = () => {
  return {
    raw: '',
    affected: 1,
    generatedMaps: [],
  };
};

export const paginationResultEmployeeJobInformationData = () => {
  return {
    items: [employeeJobInformationData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

export const updateEmployeeJobInformationData = () => {
  return {
    raw: [],
    generatedMaps: [],
    affected: 1,
  };
};
