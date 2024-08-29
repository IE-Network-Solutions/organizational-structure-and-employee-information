import { Pagination } from 'nestjs-typeorm-paginate';
import { Organization } from '../entities/organization.entity';
import { CreateOrganizationDto } from '../dto/create-organization.dto';

export const organizationData = (): Organization => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',

    workScheduleId: '468b4793-8b5a-4155-a9fa-180cadf6d749',
    calendarId: '55f70e77-774d-4bfd-a2f0-8416ddbc4970',
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    updatedAt: new Date('2022-10-22 07:11:42'),
    createdAt: new Date('2022-10-22 07:11:42'),
    workSchedule: null,
    calendar: null,
    hasFinishedOnBoarding: false
  };
};

export const createOrganizationData = (): CreateOrganizationDto => {
  return {
    workScheduleId: '468b4793-8b5a-4155-a9fa-180cadf6d749',
    calendarId: '55f70e77-774d-4bfd-a2f0-8416ddbc4970',
    //   tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
  };
};
export const deleteOrganizationData = () => {
  return {
    raw: '',
    affected: 1,
    generatedMaps: [],
  };
};

export const UpdateOrganizationDataReturned = () => {
  return {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };
};

export const paginationResultOrganizationData =
  (): Pagination<Organization> => {
    return {
      items: [organizationData()],
      meta: {
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
    };
  };

export const updateOrganizationData = () => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',

    workScheduleId: '468b4793-8b5a-4155-a9fa-180cadf6d749',
    calendarId: '55f70e77-774d-4bfd-a2f0-8416ddbc4970',
    //  tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
  };
};
export const createOrganizationDataOnCreate = () => {
  return {
    workScheduleId: '468b4793-8b5a-4155-a9fa-180cadf6d749',
    calendarId: '55f70e77-774d-4bfd-a2f0-8416ddbc4970',
  };
};

export const findOneNotFoundReturnValue = () => {
  return {
    statusCode: 404,
    message: 'organization with Id 4567 not found',
    error: 'Not Found',
  };
};
