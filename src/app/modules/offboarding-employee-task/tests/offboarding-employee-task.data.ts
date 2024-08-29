import { CreateOffboardingEmployeeTaskDto } from './../dto/create-offboarding-employee-task.dto';
import { OffboardingEmployeeTask } from '../entities/offboarding-employee-task.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

export const offboardingEmployeeTaskData = (): OffboardingEmployeeTask => {
  return {
    id: '1',
    title: 'Return Company Equipment',
    description: 'Ensure all company equipment is returned.',
    isCompleted: false,
    completedDate: null,
    tenantId: 'tenant-id-123',
    employeTerminationId: 'termination-id-456',
    approverId: 'approver-id-789',
    createdAt: new Date('2022-10-22 07:11:42'),
    updatedAt: new Date('2022-10-22 07:11:42'),
    deletedAt: null,
    approver: undefined,
    employeTermination: undefined
  };

};

export const createOffboardingEmployeeTask = (): CreateOffboardingEmployeeTaskDto => {
  return {
    title: 'Submit Final Report',
    description: 'Submit a final report of all tasks completed.',
    isCompleted: false,
    tenantId: 'tenant-id-123',
    employeTerminationId: 'termination-id-456',
    approverId: 'approver-id-789',
    completedDate: new Date('2022-10-22 07:11:42'),
  };
};

export const findAllOffboardingEmployeeTasks = (): Pagination<OffboardingEmployeeTask> => {
  return {
    items: [offboardingEmployeeTaskData()],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };
};

export const updateOffboardingEmployeeTask = () => {
  return {
    raw: [],
    generatedMaps: [],
    affected: 1,
  };
};

export const deleteOffboardingEmployeeTask = () => {
  return {
    raw: [],
    affected: 1,
    generatedMaps: [],
  };
};
