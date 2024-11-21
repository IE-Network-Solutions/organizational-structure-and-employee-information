import { Pagination } from 'nestjs-typeorm-paginate';
import { Calendar } from '../entities/calendar.entity';
import { CreateCalendarDto } from '../dto/create-calendar.dto';
import { CreateClosedDatesDto } from '../dto/create-closed-dates.dto';

export const calendarData = (): Calendar => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    name: 'cal 1',
    description: 'cal 1',
    endDate: new Date('2022-10-22 07:11:42'),
    startDate: new Date('2022-10-22 07:11:42'),
    isActive: true,
    closedDates: [calendarClosedDatesData()],
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    updatedAt: new Date('2022-10-22 07:11:42'),
    createdAt: new Date('2022-10-22 07:11:42'),
    organizations: null,
    sessions:null
  };
};

export const calendarClosedDatesData = (): CreateClosedDatesDto => {
  return {
    id: '2',
    name: "New Year's Day",
    date: new Date('2022-10-22 07:11:42'),
    type: 'Holiday',
    description: 'Short description',
  };
};

export const createCalendarData = (): CreateCalendarDto => {
  return {
    name: 'cal 1',
    description: 'cal 1',
    endDate: new Date('2022-10-22 07:11:42'),
    startDate: new Date('2022-10-22 07:11:42'),
    closedDates: [],

    //   tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
  };
};
export const deleteCalendarData = () => {
  return {
    raw: '',
    affected: 1,
    generatedMaps: [],
  };
};

export const UpdateCalendarDataReturned = () => {
  return {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };
};

export const paginationResultCalendarData = (): Pagination<Calendar> => {
  return {
    items: [calendarData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

export const updateCalendarData = () => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',

    name: 'cal 1',
    description: 'cal 1',
    endDate: new Date('2022-10-22 07:11:42'),
    startDate: new Date('2022-10-22 07:11:42'),
    closedDates: [],
    //  tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
  };
};
export const createCalendarDataOnCreate = () => {
  return {
    name: 'cal 1',
    description: 'cal 1',
    endDate: new Date('2022-10-22 07:11:42'),
    startDate: new Date('2022-10-22 07:11:42'),
    isActive: true,
    closedDates: [],
  };
};

export const findOneNotFoundReturnValue = () => {
  return {
    statusCode: 404,
    message: 'Calendar with Id 4567 not found',
    error: 'Not Found',
  };
};
