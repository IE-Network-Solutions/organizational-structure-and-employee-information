import {
  createMonthData,
  findOneNotFoundReturnValue,
  monthData,
  PaginationResultMonthData,
  tenantId,
  updateMonthData,
} from '../tests/month.data';
import { CreateMonthDto } from '../dto/create-month.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { UpdateMonthDto } from '../dto/update-month.dto';

export const MonthService = jest.fn().mockReturnValue({
  createMonth: jest
    .fn()
    .mockImplementation((dto: CreateMonthDto, tenantId: string) => {
      return Promise.resolve(createMonthData());
    }),

  findAllMonths: jest
    .fn()
    .mockImplementation(
      (tenantId: string, paginationOptions?: PaginationDto) => {
        return Promise.resolve(PaginationResultMonthData());
      },
    ),

  findOneMonth: jest.fn().mockImplementation((id: string) => {
    if (id === 'be21f28b-4651-4d6f-8f08-d8128da64ee5') {
      return Promise.resolve(findOneNotFoundReturnValue);
    }
    return Promise.resolve(monthData());
  }),

  updateMonth: jest
    .fn()
    .mockImplementation((id: string, dto: UpdateMonthDto, tenantId: string) => {
      return Promise.resolve(updateMonthData());
    }),

  removeMonth: jest.fn().mockImplementation((id: string) => {
    return Promise.resolve({ id });
  }),
});
