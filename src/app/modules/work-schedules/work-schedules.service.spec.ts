import { Test, TestingModule } from '@nestjs/testing';
import { WorkSchedulesService } from './work-schedules.service';
import { Repository } from 'typeorm';
import { WorkSchedule } from './entities/work-schedule.entity';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  createWorkSworkScheduleData,
  paginationResultWorkSworkScheduleData,
  updateWorkSworkScheduleData,
  workScheduleData,
} from './tests/work-schedule.data';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule.dto';

describe('WorkSchedulesService', () => {
  let service: WorkSchedulesService;
  let repository: Repository<WorkSchedule>;
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
        WorkSchedulesService,
        {
          provide: getRepositoryToken(WorkSchedule),
          useFactory: mockRepository,
        },
        { provide: PaginationService, useFactory: mockPaginationService },
        { provide: OrganizationsService, useFactory: mockOrganizationsService },
      ],
    }).compile();

    service = module.get<WorkSchedulesService>(WorkSchedulesService);
    repository = module.get<Repository<WorkSchedule>>(
      getRepositoryToken(WorkSchedule),
    );
    paginationService = module.get<PaginationService>(PaginationService);
    organizationsService =
      module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createWorkSchedule', () => {
    it('should create a work schedule and an organization', async () => {
      const dto = createWorkSworkScheduleData();
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      const createdWorkSchedule = workScheduleData();

      repository.create = jest.fn().mockReturnValue(createdWorkSchedule);
      repository.save = jest.fn().mockResolvedValue(createdWorkSchedule);
      organizationsService.createOrganiztion = jest
        .fn()
        .mockResolvedValue(undefined);

      const result = await service.createWorkSchedule(dto, tenantId);

      expect(result).toEqual(createdWorkSchedule);
      expect(repository.create).toHaveBeenCalledWith({ ...dto, tenantId });
      expect(repository.save).toHaveBeenCalledWith(createdWorkSchedule);
      expect(organizationsService.createOrganiztion).toHaveBeenCalledWith(
        { workScheduleId: createdWorkSchedule.id },
        tenantId,
      );
    });

    it('should throw BadRequestException on error', async () => {
      const dto = createWorkSworkScheduleData();
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';

      repository.create = jest.fn().mockReturnValue(dto);
      repository.save = jest.fn().mockRejectedValue(new Error('Error'));

      await expect(service.createWorkSchedule(dto, tenantId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAllWorkSchedules', () => {
    it('should return paginated work schedules', async () => {
      const paginationOptions: PaginationDto = {
        page: 1,
        limit: 10,
        orderBy: 'id',
        orderDirection: 'ASC',
      };
      const tenantId = '8f2e3691-423f-4f21-b676-ba3a932b7c7c';
      const paginatedResult: Pagination<WorkSchedule> =
        paginationResultWorkSworkScheduleData();

      paginationService.paginate = jest.fn().mockResolvedValue(paginatedResult);

      const result = await service.findAllWorkSchedules(
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

  describe('findOneWorkSchedule', () => {
    it('should return a work schedule by id', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const workSchedule = workScheduleData();

      repository.findOneByOrFail = jest.fn().mockResolvedValue(workSchedule);

      const result = await service.findOneWorkSchedule(id);

      expect(result).toEqual(workSchedule);
      expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException if work schedule not found', async () => {
      const id = '4567';

      repository.findOneByOrFail = jest
        .fn()
        .mockRejectedValue(new Error('Not Found'));

      await expect(service.findOneWorkSchedule(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateWorkSchedule', () => {
    it('should throw NotFoundException if work schedule not found', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const updateDto = new UpdateWorkScheduleDto();

      jest
        .spyOn(repository, 'findOneByOrFail')
        .mockRejectedValue(
          new NotFoundException(`WorkSchedule with Id ${id} not found`),
        );

      await expect(service.updateWorkSchedule(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException on error', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const updateDto = new UpdateWorkScheduleDto();

      jest
        .spyOn(repository, 'findOneByOrFail')
        .mockResolvedValue({ id } as WorkSchedule); // Mock a found work schedule
      jest
        .spyOn(repository, 'update')
        .mockRejectedValue(new Error('Database update failed'));

      await expect(service.updateWorkSchedule(id, updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeWorkSchedule', () => {
    it('should remove a work schedule', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';
      const workSchedule = workScheduleData();

      repository.findOneByOrFail = jest.fn().mockResolvedValue(workSchedule);
      repository.softRemove = jest.fn().mockResolvedValue(workSchedule);

      const result = await service.removeWorkSchedule(id);

      expect(result).toEqual(workSchedule);
      expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
      expect(repository.softRemove).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException if work schedule not found', async () => {
      const id = 'be21f28b-4651-4d6f-8f08-d8128da64ee5';

      repository.findOneByOrFail = jest
        .fn()
        .mockRejectedValue(new Error('Not Found'));

      await expect(service.removeWorkSchedule(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
