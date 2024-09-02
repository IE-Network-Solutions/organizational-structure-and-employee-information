import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';

import { OffboardingEmployeeTask } from './entities/offboarding-employee-task.entity';
import { CreateOffboardingEmployeeTaskDto } from './dto/create-offboarding-employee-task.dto';
import { UpdateOffboardingEmployeeTaskDto } from './dto/update-offboarding-employee-task.dto';

import { OffboardingEmployeeTaskService } from './offboarding-employee-task.service';
import {
  createOffboardingEmployeeTask,
  deleteOffboardingEmployeeTask,
  findAllOffboardingEmployeeTasks,
  offboardingEmployeeTaskData,
  updateOffboardingEmployeeTask,
} from './tests/offboarding-employee-task.data';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { PaginationService } from '@root/src/core/pagination/pagination.service';

describe('OffboardingEmployeeTaskService', () => {
  let offboardingEmployeeTaskService: OffboardingEmployeeTaskService;
  let offboardingEmployeeTaskRepository: MockProxy<
    Repository<OffboardingEmployeeTask>
  >;
  let paginationService: MockProxy<PaginationService>;
  const offboardingEmployeeTaskToken = getRepositoryToken(
    OffboardingEmployeeTask,
  );

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OffboardingEmployeeTaskService,
        {
          provide: offboardingEmployeeTaskToken,
          useValue: mock<Repository<OffboardingEmployeeTask>>(),
        },
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
      ],
    }).compile();

    offboardingEmployeeTaskService =
      moduleRef.get<OffboardingEmployeeTaskService>(
        OffboardingEmployeeTaskService,
      );
    offboardingEmployeeTaskRepository = moduleRef.get(
      offboardingEmployeeTaskToken,
    );
    paginationService = moduleRef.get(PaginationService);
  });

  describe('create', () => {
    describe('when create is called', () => {
      let createOffboardingEmployeeTaskDto: CreateOffboardingEmployeeTaskDto;
      let offboardingEmployeeTask: OffboardingEmployeeTask;

      beforeEach(() => {
        createOffboardingEmployeeTaskDto =
          createOffboardingEmployeeTask() as CreateOffboardingEmployeeTaskDto;
        offboardingEmployeeTask = offboardingEmployeeTaskData();

        offboardingEmployeeTaskRepository.create.mockReturnValue(
          offboardingEmployeeTask,
        );
        offboardingEmployeeTaskRepository.save.mockResolvedValue(
          offboardingEmployeeTask,
        );
      });

      it('should call offboardingEmployeeTaskRepository.create', async () => {
        await offboardingEmployeeTaskService.create('tenant-id-123', [
          createOffboardingEmployeeTaskDto,
        ]);
        expect(offboardingEmployeeTaskRepository.create).toHaveBeenCalledWith({
          ...createOffboardingEmployeeTaskDto,
          tenantId: 'tenant-id-123',
        });
      });

      it('should call offboardingEmployeeTaskRepository.save', async () => {
        await offboardingEmployeeTaskService.create('tenant-id-123', [
          createOffboardingEmployeeTaskDto,
        ]);
        expect(offboardingEmployeeTaskRepository.save).toHaveBeenCalledWith([
          offboardingEmployeeTask,
        ]);
      });

      it('should return the created task', async () => {
        const result = await offboardingEmployeeTaskService.create(
          'tenant-id-123',
          [createOffboardingEmployeeTaskDto],
        );
        expect(result).toEqual(offboardingEmployeeTask);
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let offboardingEmployeeTask: OffboardingEmployeeTask;

      beforeEach(() => {
        offboardingEmployeeTask = offboardingEmployeeTaskData(); // Ensure this returns the correct mock data
        offboardingEmployeeTaskRepository.findOne.mockResolvedValue(
          offboardingEmployeeTask,
        ); // Mock the return value
      });

      it('should call offboardingEmployeeTaskRepository.findOne with the correct where clause', async () => {
        await offboardingEmployeeTaskService.findOne(
          offboardingEmployeeTaskData().id,
        );
        expect(offboardingEmployeeTaskRepository.findOne).toHaveBeenCalledWith({
          where: { id: offboardingEmployeeTaskData().id },
        });
      });

      it('should return the found task', async () => {
        const result = await offboardingEmployeeTaskService.findOne(
          offboardingEmployeeTaskData().id,
        );
        expect(result).toEqual(offboardingEmployeeTask); // Should match the expected mock data
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      beforeEach(() => {
        paginationService.paginate.mockResolvedValue(
          findAllOffboardingEmployeeTasks(),
        );
      });

      it('should return paginated OffboardingEmployeeTasks', async () => {
        const result = await offboardingEmployeeTaskService.findAll(
          paginationOptions(),
        );
        expect(result).toEqual(findAllOffboardingEmployeeTasks());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let updateOffboardingEmployeeTaskDto: UpdateOffboardingEmployeeTaskDto;

      beforeEach(() => {
        updateOffboardingEmployeeTaskDto =
          createOffboardingEmployeeTask() as UpdateOffboardingEmployeeTaskDto;
        offboardingEmployeeTaskRepository.findOne.mockResolvedValue(
          offboardingEmployeeTaskData(),
        );
        offboardingEmployeeTaskRepository.update.mockResolvedValue(
          updateOffboardingEmployeeTask(),
        );
        offboardingEmployeeTaskRepository.findOne.mockResolvedValue(
          offboardingEmployeeTaskData(),
        );
      });

      it('should call offboardingEmployeeTaskRepository.findOne initially', async () => {
        await offboardingEmployeeTaskService.update(
          offboardingEmployeeTaskData().id,
          updateOffboardingEmployeeTaskDto,
          'tenantId',
        );
      });

      it('should call offboardingEmployeeTaskRepository.update with correct parameters', async () => {
        await offboardingEmployeeTaskService.update(
          offboardingEmployeeTaskData().id,
          updateOffboardingEmployeeTaskDto,
          'tenantId',
        );
        expect(offboardingEmployeeTaskRepository.update).toHaveBeenCalledWith(
          offboardingEmployeeTaskData().id,
          {
            ...updateOffboardingEmployeeTaskDto,
            tenantId: 'tenantId',
          },
        );
      });

      it('should return the updated task', async () => {
        const result = await offboardingEmployeeTaskService.update(
          offboardingEmployeeTaskData().id,
          updateOffboardingEmployeeTaskDto,
          'tenantId',
        );
        expect(result).toEqual(offboardingEmployeeTaskData());
      });
    });
  });

  describe('remove', () => {
    describe('when removeOffboardingEmployeeTaskService is called', () => {
      it('should call offboardingEmployeeTaskRepository.delete', async () => {
        await offboardingEmployeeTaskService.remove(
          offboardingEmployeeTaskData().id,
        );
        expect(
          offboardingEmployeeTaskRepository.softRemove,
        ).toHaveBeenCalledWith({ id: offboardingEmployeeTaskData().id });
      });
      it('should return void when the offboardingEmployeeTaskService is removed', async () => {
        const result = await offboardingEmployeeTaskService.remove(
          offboardingEmployeeTaskData().id,
        );
        expect(result).toEqual(undefined);
      });
    });
  });
});
