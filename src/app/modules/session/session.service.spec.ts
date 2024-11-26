import { Test } from '@nestjs/testing';
import { SessionService } from './session.service';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { MockProxy, mock } from 'jest-mock-extended';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { calendarMock, sessionMock } from './tests/test.data';
import { CreateSessionDto } from './dto/create-session.dto';

describe('SessionService', () => {
  let sessionService: SessionService;
  let sessionRepository: MockProxy<Repository<Session>>;
  let paginationService: MockProxy<PaginationService>;
  const sessionToken = getRepositoryToken(Session);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
        {
          provide: sessionToken,
          useValue: mock<Repository<Session>>(),
        },
      ],
    }).compile();

    sessionService = moduleRef.get<SessionService>(SessionService);
    sessionRepository = moduleRef.get(sessionToken);
    paginationService = moduleRef.get(PaginationService);
  });

  describe('createSession', () => {
    let session: Session;

    beforeEach(async () => {
      sessionRepository.create.mockReturnValue(calendarMock());
      sessionRepository.save.mockResolvedValue(calendarMock());
    });

    it('should call sessionRepository.create with the correct data', async () => {
      session = await sessionService.createSession(
        CreateSessionDto(),
        'tenantId',
      );
      expect(sessionRepository.create).toHaveBeenCalledWith({
        ...CreateSessionDto(),
        tenantId: 'tenantId',
      });
    });

    it('should call sessionRepository.save and return the session', async () => {
      session = await sessionService.createSession(
        CreateSessionDto(),
        'tenantId',
      );
      expect(sessionRepository.save).toHaveBeenCalledWith(calendarMock());
      expect(session).toEqual(calendarMock());
    });
  });

  describe('findAllSessions', () => {
    beforeEach(async () => {
      paginationService.paginate.mockResolvedValue(paginatedSessionData());
    });

    it('should call paginationService.paginate with the correct query', async () => {
      const paginationOptions: PaginationDto = { page: 1, limit: 10 };
      await sessionService.findAllSessions('tenantId', paginationOptions);
      expect(paginationService.paginate).toHaveBeenCalled();
    });

    it('should return paginated sessions', async () => {
      const paginationOptions: PaginationDto = { page: 1, limit: 10 };
      const result = await sessionService.findAllSessions(
        'tenantId',
        paginationOptions,
      );
      expect(result).toEqual(paginatedSessionData());
    });
  });

  describe('findOneSession', () => {
    let session: Session;

    beforeEach(async () => {
      sessionRepository.findOne.mockResolvedValue(sessionMock());
    });

    it('should call sessionRepository.findOne with the correct ID', async () => {
      session = await sessionService.findOneSession(calendarMock().id);
      expect(sessionRepository.findOne).toHaveBeenCalledWith({
        where: { id: calendarMock().id },
      });
    });

    it('should return the session if found', async () => {
      session = await sessionService.findOneSession(calendarMock().id);
      expect(session).toEqual(calendarMock());
    });
  });

  describe('updateSession', () => {
    let session: Session;

    beforeEach(async () => {
      sessionRepository.findOne.mockResolvedValue(sessionMock());
      sessionRepository.update.mockResolvedValue({ affected: 1 } as any);
    });

    it('should call sessionRepository.findOne and sessionRepository.update', async () => {
      session = await sessionService.updateSession(
        calendarMock().id,
        updateSessionDto(),
        'tenantId',
      );
      expect(sessionRepository.findOne).toHaveBeenCalledWith({
        where: { id: calendarMock().id },
      });
      expect(sessionRepository.update).toHaveBeenCalledWith(
        { id: calendarMock().id },
        updateSessionDto(),
      );
    });

    it('should return the updated session', async () => {
      session = await sessionService.updateSession(
        calendarMock().id,
        updateSessionDto(),
        'tenantId',
      );
      expect(session).toEqual(calendarMock());
    });
  });

  describe('removeSession', () => {
    let session: Session;

    beforeEach(async () => {
      sessionRepository.findOne.mockResolvedValue(sessionMock());
      sessionRepository.softRemove.mockResolvedValue(sessionMock());
    });

    it('should call sessionRepository.findOne and sessionRepository.softRemove', async () => {
      session = await sessionService.removeSession(calendarMock().id);
      expect(sessionRepository.findOne).toHaveBeenCalledWith({
        where: { id: calendarMock().id },
      });
      expect(sessionRepository.softRemove).toHaveBeenCalledWith({
        id: calendarMock().id,
      });
    });

    it('should return the removed session', async () => {
      session = await sessionService.removeSession(calendarMock().id);
      expect(session).toEqual(calendarMock());
    });
  });
});
