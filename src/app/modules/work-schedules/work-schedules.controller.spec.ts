import { Test, TestingModule } from '@nestjs/testing';
import { WorkSchedulesController } from './work-schedules.controller';
import { WorkSchedulesService } from './work-schedules.service';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule.dto';
import { WorkSchedule } from './entities/work-schedule.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Request } from 'express';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  createWorkSworkScheduleData,
  paginationResultWorkSworkScheduleData,
  workScheduleData,
} from './tests/work-schedule.data';
describe('WorkSchedulesController', () => {
  let controller: WorkSchedulesController;
  let service: WorkSchedulesService;

  const mockService = () => ({
    createWorkSchedule: jest.fn(),
    findAllWorkSchedules: jest.fn(),
    findOneWorkSchedule: jest.fn(),
    updateWorkSchedule: jest.fn(),
    removeWorkSchedule: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkSchedulesController],
      providers: [{ provide: WorkSchedulesService, useFactory: mockService }],
    }).compile();

    controller = module.get<WorkSchedulesController>(WorkSchedulesController);
    service = module.get<WorkSchedulesService>(WorkSchedulesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createWorkSchedule', () => {
    it('should call service.createWorkSchedule and return the result', async () => {
      const dto = createWorkSworkScheduleData();
      const tenantId = 'tenant-id';
      const result = workScheduleData();

      jest
        .spyOn(service, 'createWorkSchedule')
        .mockResolvedValue(result as any);

      const req = { tenantId } as Partial<Request> & { tenantId: string };
      const response = await controller.createWorkSchedule(req as any, dto);

      expect(response).toEqual(result);
      expect(service.createWorkSchedule).toHaveBeenCalledWith(dto, tenantId);
    });
  });

  describe('findAllWorkSchedule', () => {
    it('should call service.findAllWorkSchedules and return the result', async () => {
      const paginationOptions = new PaginationDto();
      const tenantId = 'tenant-id';
      const result: Pagination<WorkSchedule> =
        paginationResultWorkSworkScheduleData();

      jest.spyOn(service, 'findAllWorkSchedules').mockResolvedValue(result);

      const req = { tenantId } as Partial<Request> & { tenantId: string };
      const response = await controller.findAllWorkSchedule(
        req as any,
        paginationOptions,
      );

      expect(response).toEqual(result);
      expect(service.findAllWorkSchedules).toHaveBeenCalledWith(
        paginationOptions,
        tenantId,
      );
    });
  });

  describe('findOneWorkSchedule', () => {
    it('should call service.findOneWorkSchedule and return the result', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const result = workScheduleData();

      jest
        .spyOn(service, 'findOneWorkSchedule')
        .mockResolvedValue(result as any);

      const response = await controller.findOneWorkSchedule(id);

      expect(response).toEqual(result);
      expect(service.findOneWorkSchedule).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if work schedule not found', async () => {
      const id = '4567';

      jest
        .spyOn(service, 'findOneWorkSchedule')
        .mockRejectedValue(
          new NotFoundException('WorkSWorkSchedule with Id 4567 not found'),
        );

      await expect(controller.findOneWorkSchedule(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateWorkSchedule', () => {
    it('should call service.updateWorkSchedule and return the result', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const dto = new UpdateWorkScheduleDto();
      const result = workScheduleData();

      jest
        .spyOn(service, 'updateWorkSchedule')
        .mockResolvedValue(result as any);

      const response = await controller.updateWorkSchedule(id, dto);

      expect(response).toEqual(result);
      expect(service.updateWorkSchedule).toHaveBeenCalledWith(id, dto);
    });

    it('should throw BadRequestException on error', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const dto = new UpdateWorkScheduleDto();

      jest
        .spyOn(service, 'updateWorkSchedule')
        .mockRejectedValue(new BadRequestException('Error'));

      await expect(controller.updateWorkSchedule(id, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeWorkSchedule', () => {
    it('should call service.removeWorkSchedule and return the result', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const result = workScheduleData();

      jest
        .spyOn(service, 'removeWorkSchedule')
        .mockResolvedValue(result as any);

      const response = await controller.removeWorkSchedule(id);

      expect(response).toEqual(result);
      expect(service.removeWorkSchedule).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if work schedule not found', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';

      jest
        .spyOn(service, 'removeWorkSchedule')
        .mockRejectedValue(
          new NotFoundException(
            'WorkSWorkSchedule with Id be21f28b-4651-4d6f-8f08-d8128da64ee5 not found',
          ),
        );

      await expect(controller.removeWorkSchedule(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
