import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { CreateSessionDto } from '../dto/create-session.dto';
import {
  createSessionData,
  findOneNotFoundReturnValue,
  paginationResultSessionData,
  sessionMock,
  updateSessionData,
} from '../tests/test.data';
import { UpdateSessionDto } from '../dto/update-session.dto';

export const SessionService = jest.fn().mockReturnValue({
  createSession: jest
    .fn()
    .mockImplementation((dto: CreateSessionDto, tenantId: string) => {
      return Promise.resolve(createSessionData());
    }),

  findAllSessions: jest
    .fn()
    .mockImplementation(
      (tenantId: string, paginationOptions?: PaginationDto) => {
        return Promise.resolve(paginationResultSessionData());
      },
    ),

  findOneSession: jest.fn().mockImplementation((id: string) => {
    if (id === 'be21f28b-4651-4d6f-8f08-d8128da64ee5') {
      return Promise.resolve(findOneNotFoundReturnValue);
    }
    return Promise.resolve(sessionMock());
  }),

  updateSession: jest
    .fn()
    .mockImplementation(
      (id: string, dto: UpdateSessionDto, tenantId: string) => {
        return Promise.resolve(updateSessionData());
      },
    ),

  removeSession: jest.fn().mockImplementation((id: string) => {
    return Promise.resolve({ id });
  }),
});
