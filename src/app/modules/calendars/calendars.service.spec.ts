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
import { Repository } from 'typeorm';
import { CalendarsService } from './calendars.service';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CalendarsService', () => {
  let service: CalendarsService;
  let repository: Repository<Calendar>;
  let paginationService: PaginationService;
  let organizationsService: OrganizationsService;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarsService,
        { provide: getRepositoryToken(Calendar), useFactory: mockRepository },
        { provide: PaginationService, useFactory: mockPaginationService },
        { provide: OrganizationsService, useFactory: mockOrganizationsService },
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
    it('should create a work schedule and an organization', async () => {
      const dto = createCalendarData();
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      const createdCalendar = calendarData();

      repository.create = jest.fn().mockReturnValue(createdCalendar);
      repository.save = jest.fn().mockResolvedValue(createdCalendar);
      organizationsService.createOrganiztion = jest
        .fn()
        .mockResolvedValue(undefined);

      jest.spyOn(service, 'findActiveCalander').mockResolvedValue(null); // Mock findActiveCalander to return null

      const result = await service.createCalendar(dto, tenantId);

      expect(result).toEqual(createdCalendar);
      expect(repository.create).toHaveBeenCalledWith({
        ...dto,
        isActive: true,
        tenantId,
      });
      expect(repository.save).toHaveBeenCalledWith(createdCalendar);
      expect(organizationsService.createOrganiztion).toHaveBeenCalledWith(
        { calendarId: createdCalendar.id },
        tenantId,
      );
    });

    it('should throw BadRequestException on error', async () => {
      const dto = createCalendarData();
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';

      repository.create = jest.fn().mockReturnValue(dto);
      repository.save = jest.fn().mockRejectedValue(new Error('Error'));

      jest.spyOn(service, 'findActiveCalander').mockResolvedValue(null); // Mock findActiveCalander to return null

      await expect(service.createCalendar(dto, tenantId)).rejects.toThrow(
        BadRequestException,
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

      paginationService.paginate = jest.fn().mockResolvedValue(paginatedResult);

      const result = await service.findAllCalendars(
        paginationOptions,
        tenantId,
      );

      expect(result).toEqual(paginatedResult);
      expect(paginationService.paginate).toHaveBeenCalledWith(
        repository,
        'p',
        {
          page: paginationOptions.page,
          limit: paginationOptions.limit,
        },
        paginationOptions.orderBy,
        paginationOptions.orderDirection,
        { tenantId },
      );
    });
  });

  describe('findOneCalendar', () => {
    it('should return a work schedule by id', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const Calendar = calendarData();

      repository.findOneByOrFail = jest.fn().mockResolvedValue(Calendar);

      const result = await service.findOneCalendar(id);

      expect(result).toEqual(Calendar);
      expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException if work schedule not found', async () => {
      const id = '4567';

      repository.findOneByOrFail = jest
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
      const updateDto = new UpdateCalendarDto();

      jest
        .spyOn(service, 'findOneCalendar')
        .mockRejectedValue(
          new NotFoundException(`Calendar with Id ${id} not found`),
        );

      await expect(service.updateCalendar(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException on error', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const updateDto = new UpdateCalendarDto();

      jest.spyOn(service, 'findOneCalendar').mockResolvedValue({ id } as any); // Mock a found work schedule
      repository.update = jest
        .fn()
        .mockRejectedValue(new Error('Database update failed')); // Directly use the repository variable

      await expect(service.updateCalendar(id, updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeCalendar', () => {
    it('should remove a work schedule', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const Calendar = calendarData();

      repository.findOneByOrFail = jest.fn().mockResolvedValue(Calendar);
      repository.softRemove = jest.fn().mockResolvedValue(Calendar);

      const result = await service.removeCalendar(id);

      expect(result).toEqual(Calendar);
      expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
      expect(repository.softRemove).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException if work schedule not found', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';

      repository.findOneByOrFail = jest
        .fn()
        .mockRejectedValue(new Error('Not Found'));

      await expect(service.removeCalendar(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
