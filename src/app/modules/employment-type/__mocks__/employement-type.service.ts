import { NotFoundException } from '@nestjs/common';
import {
  employementTypeData,
  paginationResultEmploymentTypeData,
} from '../tests/employement-type.data';

// import { paginationResultUserData, userData } from '../tests/user.data';

export const EmployementTypeService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(employementTypeData()),
  findAll: jest.fn().mockResolvedValue(paginationResultEmploymentTypeData()),
  findOne: jest
    .fn()
    .mockImplementation((id) =>
      id === employementTypeData().id
        ? Promise.resolve(employementTypeData())
        : Promise.reject(new NotFoundException()),
    ),

  update: jest
    .fn()
    .mockImplementation((id) =>
      id === employementTypeData().id
        ? Promise.resolve(employementTypeData())
        : Promise.reject(
            new Error(`Employement type with id ${id} not found.`),
          ),
    ),

  remove: jest
    .fn()
    .mockImplementation((id) =>
      id === employementTypeData().id
        ? Promise.resolve('Promise resolves with void')
        : Promise.reject(
            new Error(`Employement type with id ${id} not found.`),
          ),
    ),
});
