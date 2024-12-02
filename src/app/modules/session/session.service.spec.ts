import { Test } from '@nestjs/testing';
import { SessionService } from './session.service';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { MockProxy, mock } from 'jest-mock-extended';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import {
  calendarMock,
  createSessionData,
  paginationResultSessionData,
  sessionMock,
  tenantId,
} from './tests/test.data';
import { CreateSessionDto } from './dto/create-session.dto';
import { MonthService } from '../month/month.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('SessionService', () => {
  let sessionService: SessionService;
  let sessionRepository: jest.Mocked<Repository<Session>>;
  let paginationService: PaginationService;
  let monthService: MonthService;
  let queryRunner: MockProxy<QueryRunner>;
  let connection: MockProxy<Connection>;

  const sessionToken = getRepositoryToken(Session);

  beforeEach(async () => {
    queryRunner = mock<QueryRunner>();
    queryRunner.connect.mockReturnValue(Promise.resolve());
    queryRunner.startTransaction.mockReturnValue(Promise.resolve());
    queryRunner.commitTransaction.mockReturnValue(Promise.resolve());
    queryRunner.rollbackTransaction.mockReturnValue(Promise.resolve());
    queryRunner.release.mockReturnValue(Promise.resolve());

    connection = mock<Connection>();
    connection.createQueryRunner.mockReturnValue(queryRunner);
    const moduleRef = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
        {
          provide: MonthService,
          useValue: mock<MonthService>(),
        },
        {
          provide: sessionToken,
          useValue: mock<Repository<Session>>(),
        },
      ],
    }).compile();

    sessionService = moduleRef.get<SessionService>(SessionService);
    sessionRepository = moduleRef.get(sessionToken);
    paginationService = moduleRef.get<PaginationService>(PaginationService);
  });

  describe('createSession', () => {
    it('should create and return a new month', async () => {
      sessionRepository.create.mockReturnValue(sessionMock() as Session);
      sessionRepository.save.mockResolvedValue(sessionMock() as Session);

      const result = await sessionService.createSession(
        sessionMock() as any,
        'tenant-id',
      );

      expect(sessionRepository.create).toHaveBeenCalledWith({
        ...sessionMock(),
        tenantId: 'tenant-id',
      });
      expect(sessionRepository.save).toHaveBeenCalledWith(sessionMock());
      expect(result).toEqual(sessionMock());
    });
  });

  describe('findAllSession', () => {
    it('should return paginated Session', async () => {
      const paginationOptions: PaginationDto = {
        page: 1,
        limit: 10,
        orderBy: 'id',
        orderDirection: 'ASC',
      };
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      const paginatedResult: Pagination<Session> =
        paginationResultSessionData();

      const queryBuilderMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        getOne: jest.fn(),
      };
      sessionRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilderMock);

      paginationService.paginate = jest.fn().mockResolvedValue(paginatedResult);
      const result = await sessionService.findAllSessions(
        tenantId,
        paginationOptions,
      );

      expect(result).toEqual(paginatedResult);
      expect(paginationService.paginate).toHaveBeenCalledWith(
        queryBuilderMock,
        {
          page: paginationOptions.page,
          limit: paginationOptions.limit,
        },
      );
    });
  });

  describe('findOneSession', () => {
    it('should return the month when found', async () => {
      sessionRepository.findOne.mockResolvedValue(sessionMock() as Session);

      const result = await sessionService.findOneSession('month-id');

      expect(sessionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'month-id' },
      });
      expect(result).toEqual(sessionMock());
    });

    it('should throw NotFoundException if branch request not found', async () => {
      sessionRepository.findOne.mockRejectedValue(
        new NotFoundException('Session request not found'),
      );

      await expect(sessionService.findOneSession('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(sessionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
      });
    });
  });

  describe('updateSession', () => {
    it('should update and return the updated month', async () => {
      sessionRepository.findOne.mockResolvedValue(sessionMock() as Session);
      sessionRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await sessionService.updateSession(
        'month-id',
        sessionMock() as any,
        'tenant-id',
      );

      expect(sessionRepository.update).toHaveBeenCalledWith(
        { id: 'month-id' },
        sessionMock(),
      );
      expect(result).toEqual(sessionMock());
    });

    it('should throw NotFoundException when the month is not found', async () => {
      sessionRepository.findOne.mockResolvedValue(null);

      await expect(
        sessionService.updateSession('invalid-id', sessionMock(), 'tenant-id'),
      ).rejects.toThrow(new BadRequestException('Session Not Found'));
    });
  });

  describe('removeSession', () => {
    it('should soft remove the month', async () => {
      sessionRepository.findOne.mockResolvedValue(sessionMock() as Session);

      const result = await sessionService.removeSession('month-id');

      expect(sessionRepository.softRemove).toHaveBeenCalledWith({
        id: 'month-id',
      });
      expect(result).toEqual(sessionMock());
    });

    it('should throw NotFoundException if branch request not found during removal', async () => {
      const nonExistingId = 'non-existing-id';

      jest
        .spyOn(sessionService, 'findOneSession')
        .mockRejectedValue(new BadRequestException(`Session Not Found`));

      await expect(sessionService.removeSession(nonExistingId)).rejects.toThrow(
        BadRequestException,
      );

      expect(sessionRepository.softRemove).not.toHaveBeenCalled();
    });
  });
});
