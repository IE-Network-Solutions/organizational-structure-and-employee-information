import { Pagination } from 'nestjs-typeorm-paginate';
import { WorkSchedule } from '../entities/work-schedule.entity';
import { CreateWorkScheduleDto } from '../dto/create-work-schedule.dto';
import { CreateWorkScheduleDetailDto } from '../dto/create-work-schedule-detail.dto';
import { DayOfWeek } from '../enum/work-schedule-dayofweek.enum';
import { UpdateWorkScheduleDto } from '../dto/update-work-schedule.dto';

export const workScheduleData = (): WorkSchedule => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    name: 'worck schedule 1',
    detail: [],

    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    organizations: null,
    updatedAt: new Date('2022-10-22 07:11:42'),
    createdAt: new Date('2022-10-22 07:11:42'),
    employeeJobInformation: null,
  };
};

export const createWorkSworkScheduleData = (): CreateWorkScheduleDto => {
  return {
    name: 'worck schedule 1',
    detail: [],

    //   tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
  };
};
export const deleteworkScheduleData = () => {
  return {
    raw: '',
    affected: 1,
    generatedMaps: [],
  };
};

export const updateworkScheduleDataReturned = () => {
  return {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };
};

export const paginationResultWorkSworkScheduleData =
  (): Pagination<WorkSchedule> => {
    return {
      items: [workScheduleData()],
      meta: {
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
    };
  };

export const updateWorkSworkScheduleData = (): UpdateWorkScheduleDto => {
  return {
    // id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',

    name: 'worck schedule 1',
    detail: [workScheduleDetailData()],

    //  tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
  };
};
export const createworkScheduleDataOnCreate = () => {
  return {
    name: 'worck schedule 1',
    detail: [workScheduleDetailData()],
  };
};

export const findOneNotFoundReturnValue = () => {
  return {
    statusCode: 404,
    message: 'WorkSWorkSchedule with Id 4567 not found',
    error: 'Not Found',
  };
};

export const workScheduleDetailData = (): CreateWorkScheduleDetailDto => {
  return {
    id: '4',
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    hours: 8,

    status: true,
  };
};
