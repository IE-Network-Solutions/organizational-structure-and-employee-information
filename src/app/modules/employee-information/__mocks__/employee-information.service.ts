import { NotFoundException } from '@nestjs/common';
import {
  employeeInformationData,
  paginationResultEmployeeInformationData,
} from '../tests/employee-information.data';

export const EmployeeInformationService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(employeeInformationData()),
  findAll: jest
    .fn()
    .mockResolvedValue(paginationResultEmployeeInformationData()),
  findOne: jest
    .fn()
    .mockImplementation((id) =>
      id === employeeInformationData().id
        ? Promise.resolve(employeeInformationData())
        : Promise.reject(new NotFoundException()),
    ),

  update: jest
    .fn()
    .mockImplementation((id) =>
      id === employeeInformationData().id
        ? Promise.resolve(employeeInformationData())
        : Promise.reject(
            new Error(`EmployeeInformation with id ${id} not found.`),
          ),
    ),

  remove: jest
    .fn()
    .mockImplementation((id) =>
      id === employeeInformationData().id
        ? Promise.resolve('Promise resolves with void')
        : Promise.reject(
            new Error(`EmployeeInformation with id ${id} not found.`),
          ),
    ),
});
