import { Pagination } from 'nestjs-typeorm-paginate';
import { EmployeeTermination } from '../entities/employee-termination.entity';
import { TerminationType } from '@root/src/core/enum/termination-type.dto';
import { EligibleForRehire } from '@root/src/core/enum/eligible-for-hire.enum';
import { CreateEmployeeTerminationDto } from '../dto/create-employee-termination.dto';
import { UpdateEmployeeTerminationDto } from '../dto/update-employee-termination.dto';

export const employeeTerminationData = (): EmployeeTermination => ({
  id: '1',
  reason: 'Performance issues',
  type: TerminationType.Resignation,
  eligibleForRehire: EligibleForRehire.mayBe,
  comment: 'Repeated performance issues',
  jobInformationId: 'job-info-1',
  userId: '1',
  effectiveDate: new Date('2023-01-01T00:00:00.000Z'),
  tenantId: 'tenant-1',
  jobInformation: null,
  user: null,
  isActive:true,
  createdAt: new Date('2024-08-28T06:03:27.088Z'),
  updatedAt: new Date('2024-08-28T06:03:27.088Z'),
  offboardingEmployeeTask: undefined
});

export const createEmployeeTerminationData =
  (): CreateEmployeeTerminationDto => ({
    reason: 'Performance issues',
    type: TerminationType.Resignation,
    eligibleForRehire: EligibleForRehire.mayBe,
    comment: 'Repeated performance issues',
    jobInformationId: 'job-info-1',
    userId: 'user-1',
    effectiveDate: new Date('2023-01-01T00:00:00.000Z'),
  });

export const updateEmployeeTerminationData =
  (): UpdateEmployeeTerminationDto => ({
    reason: 'Updated reason',
    type: TerminationType.Resignation,
    eligibleForRehire: EligibleForRehire.mayBe,
    comment: 'Company downsizing',
    jobInformationId: 'job-info-3',
    userId: 'user-3',
    effectiveDate: new Date('2023-03-01'),
  });

export const deleteEmployeeTerminationData = () => {
  return {
    raw: [],
    affected: 1,
    generatedMaps: [],
  };
};

export const paginationResultEmployeeTerminationData =
  (): Pagination<EmployeeTermination> => {
    return {
      items: [employeeTerminationData()],
      meta: {
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
    };
  };

export const createEmployeeTerminationDataOnCreate =
  (): CreateEmployeeTerminationDto => {
    return {
      reason: 'Resignation',
      type: TerminationType.Resignation,
      eligibleForRehire: EligibleForRehire.yes,
      comment: 'Left for a better opportunity',
      jobInformationId: 'job-info-2',
      userId: 'user-2',
      effectiveDate: new Date('2023-02-01T00:00:00.000Z'),
    };
  };

export const createEmployeeTerminationDataOnSave = (): EmployeeTermination => {
  return {
    id: '2',
    reason: 'Resignation',
    type: TerminationType.Resignation,
    eligibleForRehire: EligibleForRehire.yes,
    comment: 'Left for a better opportunity',
    jobInformationId: 'job-info-2',
    userId: 'user-2',
    isActive:true,
    effectiveDate: new Date('2023-02-01T00:00:00.000Z'),
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    jobInformation: null, // Assuming this is populated elsewhere
    user: null, // Assuming this is populated elsewhere
    createdAt: new Date('2024-08-28T06:46:58.237Z'),
    updatedAt: new Date('2024-08-28T06:46:58.237Z'),
    offboardingEmployeeTask: undefined
  };
};

export const findOneNotFoundReturnValue = () => {
  return {
    statusCode: 404,
    message: 'Branch with Id 4567 not found',
    error: 'Not Found',
  };
};

export const tenantId = () => {
  return {
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
  };
};
