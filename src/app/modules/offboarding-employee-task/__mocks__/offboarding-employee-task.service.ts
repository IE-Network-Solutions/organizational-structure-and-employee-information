import { NotFoundException } from '@nestjs/common';
import { findAllOffboardingEmployeeTasks, offboardingEmployeeTaskData } from '../tests/offboarding-employee-task.data';


export const OffboardingEmployeeTaskService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(offboardingEmployeeTaskData()),
  findAll: jest.fn().mockResolvedValue(findAllOffboardingEmployeeTasks()),
  findOne: jest
    .fn()
    .mockImplementation((id) =>
      id === offboardingEmployeeTaskData().id
        ? Promise.resolve(offboardingEmployeeTaskData())
        : Promise.reject(new NotFoundException()),
    ),
  update: jest
    .fn()
    .mockImplementation((id) =>
      id === offboardingEmployeeTaskData().id
        ? Promise.resolve(offboardingEmployeeTaskData())
        : Promise.reject(new Error(`Task with id ${id} not found.`)),
    ),
  remove: jest
    .fn()
    .mockImplementation((id) =>
      id === offboardingEmployeeTaskData().id
        ? Promise.resolve('Promise resolves with void')
        : Promise.reject(new Error(`Task with id ${id} not found.`)),
    ),
});
