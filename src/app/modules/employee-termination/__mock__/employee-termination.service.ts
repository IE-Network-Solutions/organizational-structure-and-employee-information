import { NotFoundException } from '@nestjs/common';
import {
  employeeTerminationData,
  paginationResultEmployeeTerminationData,
} from '../tests/employee-termination.data';

export const EmployeeTerminationService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(employeeTerminationData()),
  findAll: jest
    .fn()
    .mockResolvedValue(paginationResultEmployeeTerminationData()),
  findOne: jest
    .fn()
    .mockImplementation((id) =>
      id === employeeTerminationData().id
        ? Promise.resolve(employeeTerminationData())
        : Promise.reject(new NotFoundException()),
    ),
  update: jest
    .fn()
    .mockImplementation((id) =>
      id === employeeTerminationData().id
        ? Promise.resolve(employeeTerminationData())
        : Promise.reject(
            new Error(`EmployeeTerminationData with id ${id} not found.`),
          ),
    ),
  remove: jest
    .fn()
    .mockImplementation((id) =>
      id === employeeTerminationData().id
        ? Promise.resolve('Promise resolves with void')
        : Promise.reject(
            new Error(`EmployeeTerminationData with id ${id} not found.`),
          ),
    ),
});
