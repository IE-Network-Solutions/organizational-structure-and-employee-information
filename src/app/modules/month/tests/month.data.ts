import { Pagination } from 'nestjs-typeorm-paginate';
import { Session } from '../../session/entities/session.entity';
import { CreateMonthDto } from '../dto/create-month.dto';
import { Month } from '../entities/month.entity';
import { error } from 'console';

export const monthData = (): Month => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    name: 'January',
    description: 'First month of the year',
    sessionId: 'a823f28b-1234-4d6f-8f08-d8128da64abc',
    session: {
      id: 'a823f28b-1234-4d6f-8f08-d8128da64abc',
      name: '2024 Fiscal Year',
      startDate: new Date('2024-01-01T00:00:00Z'),
      endDate: new Date('2024-12-31T23:59:59Z'),
      tenantId: 'f65bd3d9-ffcc-4e68-8755-aeef3bd18e52',
      createdAt: new Date('2023-12-15T10:00:00Z'),
      updatedAt: new Date('2023-12-15T10:00:00Z'),
    } as Session,
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: new Date('2024-01-31T23:59:59Z'),
    active: true,
    tenantId: 'f65bd3d9-ffcc-4e68-8755-aeef3bd18e52',
    createdAt: new Date('2022-10-22T07:11:42Z'),
    updatedAt: new Date('2022-10-22T07:11:42Z'),
  };
};

export const monthDataSave = () => {
  return {
    name: 'January',
    description: 'First month of the year',
    sessionId: 'a823f28b-1234-4d6f-8f08-d8128da64abc',
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: new Date('2024-01-31T23:59:59Z'),
    active: true,
  };
};

export const createMonthData = (): CreateMonthDto => {
  return {
    name: 'January',
    description: 'First month of the year',
    sessionId: 'a823f28b-1234-4d6f-8f08-d8128da64abc',
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: new Date('2024-01-31T23:59:59Z'),
    active: true,
  };
};

export const deleteMonthData = (): {
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

export const updateMonthDataReturned = (): {
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

export const PaginationResultMonthData = (): Pagination<Month> => {
  return {
    items: [monthData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

export const updateMonthData = () => {
  return {
    id: 'be21f28b-4651-4d6f-8f08-d8128da64ee5',
    name: 'January',
    description: 'First month of the year',
    sessionId: 'a823f28b-1234-4d6f-8f08-d8128da64abc',
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: new Date('2024-01-31T23:59:59Z'),
    active: true,
  };
};

export const findOneNotFoundReturnValue = () => {
  return {
    statusCode: 404,
    message: 'Month with Id 235 not found',
    error: 'Not Found',
  };
};

export const tenantId = () => {
  return {
    tenantId: '8f2e3691-423f-4f21-b676-ba3a932b7c7c',
  };
};
