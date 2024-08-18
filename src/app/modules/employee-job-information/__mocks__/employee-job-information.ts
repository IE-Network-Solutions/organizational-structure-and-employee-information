import {
  employeeJobInformationData,
  paginationResultEmployeeJobInformationData,
} from './../tests/employee-job-information.data';
import { NotFoundException } from '@nestjs/common';

export const EmployeeJobInformationService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(employeeJobInformationData()),
  findAll: jest
    .fn()
    .mockResolvedValue(paginationResultEmployeeJobInformationData()),
  findOne: jest
    .fn()
    .mockImplementation((id) =>
      id === employeeJobInformationData().id
        ? Promise.resolve(employeeJobInformationData())
        : Promise.reject(new NotFoundException()),
    ),

  update: jest
    .fn()
    .mockImplementation((id) =>
      id === employeeJobInformationData().id
        ? Promise.resolve(employeeJobInformationData())
        : Promise.reject(
            new Error(`employeeJobInformation with id ${id} not found.`),
          ),
    ),

  remove: jest
    .fn()
    .mockImplementation((id) =>
      id === employeeJobInformationData().id
        ? Promise.resolve('Promise resolves with void')
        : Promise.reject(
            new Error(`employeeJobInformation with id ${id} not found.`),
          ),
    ),
});
