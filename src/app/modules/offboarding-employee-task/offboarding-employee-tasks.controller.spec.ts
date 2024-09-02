import { Test } from '@nestjs/testing';
import {
  createOffboardingEmployeeTask,
  findAllOffboardingEmployeeTasks,
  offboardingEmployeeTaskData,
} from './tests/offboarding-employee-task.data';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { searchFilter } from '@root/src/core/commonTestData/search-filter.data';
import { OffboardingEmployeeTaskController } from './offboarding-employee-tasks.controller';
import { OffboardingEmployeeTaskService } from './offboarding-employee-task.service';
import { OffboardingEmployeeTask } from './entities/offboarding-employee-task.entity';
import { UpdateOffboardingEmployeeTaskDto } from './dto/update-offboarding-employee-task.dto';

jest.mock('./offboarding-employee-task.service');

describe('OffboardingEmployeeTaskController', () => {
  let offboardingEmployeeTasksController: OffboardingEmployeeTaskController;
  let offboardingEmployeeTasksService: OffboardingEmployeeTaskService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [OffboardingEmployeeTaskController],
      providers: [OffboardingEmployeeTaskService],
    }).compile();

    offboardingEmployeeTasksController =
      moduleRef.get<OffboardingEmployeeTaskController>(
        OffboardingEmployeeTaskController,
      );
    offboardingEmployeeTasksService =
      moduleRef.get<OffboardingEmployeeTaskService>(
        OffboardingEmployeeTaskService,
      );

    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let offboardingEmployeeTask: OffboardingEmployeeTask;
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenant-id-123', // Ensure this matches your mock and actual usage
        } as any;

        (offboardingEmployeeTasksService.create as jest.Mock).mockResolvedValue(
          [offboardingEmployeeTaskData()],
        );
      });

      test('then it should call offboardingEmployeeTasksService.create with correct parameters', async () => {
        await offboardingEmployeeTasksController.create(
          request, // Pass the entire request object
          [createOffboardingEmployeeTask()],
        );

        expect(offboardingEmployeeTasksService.create).toHaveBeenCalledWith(
          offboardingEmployeeTaskData().tenantId,
          [createOffboardingEmployeeTask()],
        );
      });

      test('then it should return a task', async () => {
        const result = await offboardingEmployeeTasksController.create(
          request, // Pass the entire request object
          [createOffboardingEmployeeTask()],
        );
        expect(result).toEqual([offboardingEmployeeTaskData()]);
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenant-id-123',
        } as any;

        (
          offboardingEmployeeTasksService.findAll as jest.Mock
        ).mockResolvedValue(findAllOffboardingEmployeeTasks());

        await offboardingEmployeeTasksController.findAll(paginationOptions());
      });

      test('then it should call offboardingEmployeeTasksService.findAll with correct parameters', () => {
        expect(offboardingEmployeeTasksService.findAll).toHaveBeenCalledWith(
          paginationOptions(),
        );
      });

      test('then it should return all tasks', async () => {
        const result = await offboardingEmployeeTasksController.findAll(
          paginationOptions(),
        );
        expect(result).toEqual(findAllOffboardingEmployeeTasks());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let offboardingEmployeeTask: OffboardingEmployeeTask;

      beforeEach(async () => {
        offboardingEmployeeTask =
          await offboardingEmployeeTasksController.findOne(
            offboardingEmployeeTaskData().id,
          );
      });

      test('then it should call offboardingEmployeeTasksService', () => {
        expect(offboardingEmployeeTasksService.findOne).toHaveBeenCalledWith(
          offboardingEmployeeTaskData().id,
        );
      });

      test('then it should return a task', () => {
        expect(offboardingEmployeeTask).toEqual(offboardingEmployeeTaskData());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let offboardingEmployeeTask: OffboardingEmployeeTask;
      let updateOffboardingEmployeeTaskDto: UpdateOffboardingEmployeeTaskDto;
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenantId',
        } as any;

        (offboardingEmployeeTasksService.update as jest.Mock).mockResolvedValue(
          offboardingEmployeeTaskData(),
        );

        offboardingEmployeeTask =
          await offboardingEmployeeTasksController.update(
            request,
            offboardingEmployeeTaskData().id,
            updateOffboardingEmployeeTaskDto,
          );
      });

      test('then it should call offboardingEmployeeTasksService.update with correct parameters', () => {
        expect(offboardingEmployeeTasksService.update).toHaveBeenCalledWith(
          offboardingEmployeeTaskData().id,
          updateOffboardingEmployeeTaskDto,
          request['tenantId'],
        );
      });

      test('then it should return the updated task', () => {
        expect(offboardingEmployeeTask).toEqual(offboardingEmployeeTaskData());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        await offboardingEmployeeTasksController.remove(
          offboardingEmployeeTaskData().id,
        );
      });

      test('then it should call remove', () => {
        expect(offboardingEmployeeTasksService.remove).toHaveBeenCalledWith(
          offboardingEmployeeTaskData().id,
        );
      });

      test('then it should return void', async () => {
        expect(
          await offboardingEmployeeTasksController.remove(
            offboardingEmployeeTaskData().id,
          ),
        ).toEqual('Promise resolves with void');
      });
    });
  });
});
