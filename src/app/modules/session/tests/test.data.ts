import { Session } from '../entities/session.entity';
import { Calendar } from '../../calendars/entities/calendar.entity';
import { Month } from '../../month/entities/month.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateSessionDto } from '../dto/create-session.dto';

export const calendarMock = (): Calendar => {
  return {
    id: 'd6f8f53b-d97d-4f85-9a62-4a8a8ddc3f45',
    name: 'Academic Calendar 2024',
    description: 'Calendar for the academic year 2024.',
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: new Date('2024-12-31T23:59:59Z'),
    closedDates: null,
    isActive: true,
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    createdAt: new Date('2023-11-01T07:00:00Z'),
    updatedAt: new Date('2023-11-01T07:00:00Z'),
    organizations: [], // Assuming this is correct in your Calendar entity
    sessions: [], // Relations are empty by default in mocks
  } as Calendar;
};

export const monthMock = (): Month => {
  return {
    id: '2b1f9e65-0fd3-411d-a736-56890d3e4a23',
    name: 'January',
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: new Date('2024-01-31T23:59:59Z'),
    sessionId: 'f7b7a3f1-4bd5-4c92-85a1-22e0f4c9ed6f',
    session: null, // Avoid circular dependency in mock
    active: true,
    tenantId: '12345678-90ab-cdef-1234-567890abcdef',
    createdAt: new Date('2023-12-01T07:00:00Z'),
    updatedAt: new Date('2023-12-01T07:00:00Z'),
  } as Month;
};

export const sessionMock = (): Session => {
  return {
    id: 'f7b7a3f1-4bd5-4c92-85a1-22e0f4c9ed6f',
    name: 'Winter Session 2024',
    description: 'Winter academic session.',
    calendarId: 'd6f8f53b-d97d-4f85-9a62-4a8a8ddc3f45',
    calendar: calendarMock(),
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: new Date('2024-03-31T23:59:59Z'),
    active: true,
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
    months: [], // Ensuring valid relation
    createdAt: new Date('2023-12-01T07:00:00Z'),
    updatedAt: new Date('2023-12-01T07:00:00Z'),
  } as Session;
};

export const createSessionData = (): CreateSessionDto => {
  return {
    name: 'Winter Session 2024',
    description: 'Winter academic session.',
    calendarId: 'd6f8f53b-d97d-4f85-9a62-4a8a8ddc3f45',
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: new Date('2024-03-31T23:59:59Z'),
    months: null,
    active: false,
  };
};

export const deleteSessionData = (): {
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

export const updateSessionDataReturned = (): {
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

export const paginationResultSessionData = (): Pagination<Session> => {
  return {
    items: [sessionMock()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  } as Pagination<Session>;
};

export const updateSessionData = () => {
  return {
    id: 'f7b7a3f1-4bd5-4c92-85a1-22e0f4c9ed6f',
    name: 'Spring Session 2024',
    description: 'Updated description for the spring session.',
    startDate: new Date('2024-04-01T00:00:00Z'),
    endDate: new Date('2024-06-30T23:59:59Z'),
    active: false,
  };
};

export const findOneNotFoundReturnValue = () => {
  return {
    statusCode: 404,
    message: 'Session with the provided ID not found',
    error: 'Not Found',
  };
};

export const tenantId = () => {
  return '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
};
