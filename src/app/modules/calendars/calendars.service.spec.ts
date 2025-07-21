import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  calendarData,
  createCalendarData,
  paginationResultCalendarData,
} from './tests/calendar.data';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Calendar } from './entities/calendar.entity';
import { OrganizationsService } from '../organizations/organizations.service';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { CalendarsService } from './calendars.service';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { tenantId } from '../branchs/tests/branch.data';
import { mock, MockProxy } from 'jest-mock-extended';
import { SessionService } from '../session/session.service';

describe('CalendarsService', () => {
  let service: CalendarsService;
  let repository: Repository<Calendar>;
  let paginationService: PaginationService;
  let organizationsService: OrganizationsService;
  let connection: MockProxy<Connection>;
  let queryRunner: MockProxy<QueryRunner>;

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOneByOrFail: jest.fn(),
    update: jest.fn(),
    softRemove: jest.fn(),
  });

  const mockPaginationService = () => ({
    paginate: jest.fn(),
  });

  const mockOrganizationsService = () => ({
    createOrganiztion: jest.fn(),
  });

  beforeEach(async () => {
    queryRunner = mock<QueryRunner>();
    queryRunner.connect.mockReturnValue(Promise.resolve());
    queryRunner.startTransaction.mockReturnValue(Promise.resolve());
    queryRunner.commitTransaction.mockReturnValue(Promise.resolve());
    queryRunner.rollbackTransaction.mockReturnValue(Promise.resolve());
    queryRunner.release.mockReturnValue(Promise.resolve());

    connection = mock<Connection>();
    connection.createQueryRunner.mockReturnValue(queryRunner);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarsService,
        { provide: getRepositoryToken(Calendar), useFactory: mockRepository },
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
        { provide: OrganizationsService, useFactory: mockOrganizationsService },
        {
          provide: SessionService,
          useValue: mock<SessionService>(),
        },
        {
          provide: Connection,
          useValue: connection,
        },
      ],
    }).compile();

    service = module.get<CalendarsService>(CalendarsService);
    repository = module.get<Repository<Calendar>>(getRepositoryToken(Calendar));
    paginationService = module.get<PaginationService>(PaginationService);
    organizationsService =
      module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCalendar', () => {
    let mockQueryRunner;

    const queryBuilderMock = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      withDeleted: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([calendarData()]),
      getOne: jest.fn().mockReturnThis(),
    };

    beforeEach(() => {
      mockQueryRunner = {
        manager: {
          save: jest.fn().mockResolvedValue(createCalendarData()),
        },
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
      };
      const queryBuilderMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        withDeleted: jest.fn().mockReturnThis(), // Mock the withDeleted method
        getMany: jest.fn().mockResolvedValue([calendarData()]),
        getOne: jest.fn().mockReturnThis(),
      };
    });

    it('should create a work schedule and an organization', async () => {
      const dto = createCalendarData();
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      const createdCalendar = calendarData();
      repository.create = jest.fn().mockReturnValue(createdCalendar);
      queryRunner.manager.save = jest.fn().mockResolvedValue(createdCalendar);
      organizationsService.createOrganiztion = jest
        .fn()
        .mockResolvedValue(undefined);

      jest
        .spyOn(service, 'findActiveCalendar')
        .mockResolvedValue(calendarData());
      jest.spyOn(service, 'findOneCalendar').mockResolvedValue(calendarData());

      const result = await service.createCalendar(dto, tenantId);

      expect(result).toEqual(createdCalendar);
      expect(repository.create).toHaveBeenCalledWith({
        ...dto,
        isActive: false,
        tenantId,
      });
      expect(queryRunner.manager.save).toHaveBeenCalledWith(
        Calendar,
        createdCalendar,
      );
      expect(organizationsService.createOrganiztion).toHaveBeenCalledWith(
        { calendarId: createdCalendar.id },
        tenantId,
      );
    });
  });

  describe('findAllCalendars', () => {
    it('should return paginated work schedules', async () => {
      const paginationOptions: PaginationDto = {
        page: 1,
        limit: 10,
        orderBy: 'id',
        orderDirection: 'ASC',
      };
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      const paginatedResult: Pagination<Calendar> =
        paginationResultCalendarData();
      const queryBuilderMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        getOne: jest.fn(),
      };
      repository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilderMock);
      const options = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };

      paginationService.paginate = jest.fn().mockResolvedValue(paginatedResult);

      const result = await service.findAllCalendars(
        paginationOptions,
        tenantId,
      );

      expect(result).toEqual(paginatedResult);
      expect(paginationService.paginate).toHaveBeenCalledWith(
        queryBuilderMock,
        options,
      );
    });
  });

  describe('findOneCalendar', () => {
    it('should return a work schedule by id', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const Calendar = calendarData();

      repository.findOneOrFail = jest.fn().mockResolvedValue(Calendar);

      const result = await service.findOneCalendar(id);

      expect(result).toEqual(Calendar);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: id },
        relations: ['sessions', 'sessions.months'],
      });
    });

    it('should throw NotFoundException if work schedule not found', async () => {
      const id = '4567';

      repository.findOneOrFail = jest
        .fn()
        .mockRejectedValue(new Error('Not Found'));

      await expect(service.findOneCalendar(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateCalendar', () => {
    it('should throw NotFoundException if work schedule not found', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';

      const updateDto = new UpdateCalendarDto();

      jest
        .spyOn(service, 'findOneCalendar')
        .mockRejectedValue(
          new NotFoundException(`Calendar with Id ${id} not found`),
        );

      await expect(
        service.updateCalendar(id, updateDto, tenantId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on error', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';

      const updateDto = new UpdateCalendarDto();

      jest.spyOn(service, 'findOneCalendar').mockResolvedValue({ id } as any); // Mock a found work schedule
      repository.update = jest
        .fn()
        .mockRejectedValue(new Error('Database update failed')); // Directly use the repository variable

      await expect(
        service.updateCalendar(id, updateDto, tenantId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeCalendar', () => {
    it('should remove a work schedule', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const Calendar = calendarData();

      repository.findOneOrFail = jest.fn().mockResolvedValue(Calendar);
      repository.softRemove = jest.fn().mockResolvedValue(Calendar);

      const result = await service.removeCalendar(id);

      expect(result).toEqual(Calendar);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: id },
        relations: ['sessions', 'sessions.months'],
      });
      expect(repository.softRemove).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException if work schedule not found', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';

      repository.findOneOrFail = jest
        .fn()
        .mockRejectedValue(new Error('Not Found'));

      await expect(service.removeCalendar(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
