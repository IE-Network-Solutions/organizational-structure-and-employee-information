import { Test, TestingModule } from '@nestjs/testing';

import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Request } from 'express';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CalendarsController } from './calendars.controller';
import { CalendarsService } from './calendars.service';

import { Calendar } from './entities/calendar.entity';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import {
  calendarData,
  createCalendarData,
  paginationResultCalendarData,
} from './tests/calendar.data';
describe('CalendarsController', () => {
  let controller: CalendarsController;
  let service: CalendarsService;

  const mockService = () => ({
    createCalendar: jest.fn(),
    findAllCalendars: jest.fn(),
    findOneCalendar: jest.fn(),
    updateCalendar: jest.fn(),
    removeCalendar: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarsController],
      providers: [{ provide: CalendarsService, useFactory: mockService }],
    }).compile();

    controller = module.get<CalendarsController>(CalendarsController);
    service = module.get<CalendarsService>(CalendarsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCalendar', () => {
    it('should call service.createCalendar and return the result', async () => {
      const dto = createCalendarData();
      const tenantId = 'tenant-id';
      const result = calendarData();

      jest.spyOn(service, 'createCalendar').mockResolvedValue(result as any);

      const req = { tenantId } as Partial<Request> & { tenantId: string };
      const response = await controller.createCalendar(tenantId, dto);

      expect(response).toEqual(result);
      expect(service.createCalendar).toHaveBeenCalledWith(dto, tenantId);
    });
  });

  describe('findAllCalendars', () => {
    it('should call service.findAllCalendars and return the result', async () => {
      const paginationOptions = new PaginationDto();
      const tenantId = 'tenant-id';
      const result: Pagination<Calendar> = paginationResultCalendarData();

      jest.spyOn(service, 'findAllCalendars').mockResolvedValue(result);

      const req = { tenantId } as Partial<Request> & { tenantId: string };
      const response = await controller.findAllCalendars(
        tenantId,
        paginationOptions,
      );

      expect(response).toEqual(result);
      expect(service.findAllCalendars).toHaveBeenCalledWith(
        paginationOptions,
        tenantId,
      );
    });
  });

  describe('findOneCalendar', () => {
    it('should call service.findOneCalendar and return the result', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const result = calendarData();

      jest.spyOn(service, 'findOneCalendar').mockResolvedValue(result as any);

      const response = await controller.findOneCalendar(id);

      expect(response).toEqual(result);
      expect(service.findOneCalendar).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if work schedule not found', async () => {
      const id = '4567';

      jest
        .spyOn(service, 'findOneCalendar')
        .mockRejectedValue(
          new NotFoundException('WorkSCalendar with Id 4567 not found'),
        );

      await expect(controller.findOneCalendar(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateCalendar', () => {
    it('should call service.updateCalendar and return the result', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';

      const dto = new UpdateCalendarDto();
      const result = calendarData();

      jest.spyOn(service, 'updateCalendar').mockResolvedValue(result as any);

      const response = await controller.updateCalendar(tenantId, id, dto);

      expect(response).toEqual(result);
      expect(service.updateCalendar).toHaveBeenCalledWith(id, dto, tenantId);
    });

    it('should throw BadRequestException on error', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      const dto = new UpdateCalendarDto();

      jest
        .spyOn(service, 'updateCalendar')
        .mockRejectedValue(new BadRequestException('Error'));

      await expect(
        controller.updateCalendar(tenantId, id, dto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeCalendar', () => {
    it('should call service.removeCalendar and return the result', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const result = calendarData();

      jest.spyOn(service, 'removeCalendar').mockResolvedValue(result as any);

      const response = await controller.removeCalendar(id);

      expect(response).toEqual(result);
      expect(service.removeCalendar).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if work schedule not found', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';

      jest
        .spyOn(service, 'removeCalendar')
        .mockRejectedValue(
          new NotFoundException(
            'WorkSCalendar with Id be21f28b-4651-4d6f-8f08-d8128da64ee5 not found',
          ),
        );

      await expect(controller.removeCalendar(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
