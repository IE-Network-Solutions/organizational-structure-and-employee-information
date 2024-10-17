import { JobPosition } from '../entities/job-position.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateJobPositionDto } from '../dto/create-job-position.dto';

// Mock data for a JobPosition entity
export const jobPositionData = (): JobPosition => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    name: 'Software Developer',
    description: 'Responsible for developing software solutions.',
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    updatedAt: new Date('2022-10-22T07:11:42Z'),
    createdAt: new Date('2022-10-22T07:11:42Z'),
  };
};

// Data for creating a new JobPosition
export const createJobPositionData = (): CreateJobPositionDto => {
  return {
    name: 'Software Developer',
    description: 'Position for developing software applications',
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
  };
};

// Data returned when deleting a JobPosition
export const deleteJobPositionData = (): {
  raw: string;
  affected: number;
  generatedMaps: any[];
} => {
  return {
    raw: '',
    affected: 1,
    generatedMaps: [],
  };
};

// Data returned when updating a JobPosition
export const updateJobPositionDataReturned = (): {
  generatedMaps: any[];
  raw: any[];
  affected: number;
} => {
  return {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };
};

// Pagination result for JobPosition
export const paginationResultJobPositionData = (): Pagination<JobPosition> => {
  return {
    items: [jobPositionData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

// Data for updating an existing JobPosition
export const updateJobPositionData = () => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    name: 'Lead Software Developer',
    description: 'Lead and manage a team of software developers.',
  };
};

// Data for a JobPosition entity upon creation
export const createJobPositionOnSave = () => {
  return {
    name: 'Software Developer',
    description: 'Responsible for developing software applications.',
  };
};

// Return value when JobPosition is not found
export const findOneNotFoundReturnValue = () => {
  return {
    statusCode: 404,
    message: 'JobPosition with Id 23456 not found',
    error: 'Not Found',
  };
};

// Tenant ID used for multi-tenant systems
export const tenantId = () => {
  return {
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
  };
};
