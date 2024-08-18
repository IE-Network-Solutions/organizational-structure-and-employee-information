import { NotFoundException } from '@nestjs/common';
import { findAllRoles, roleData } from '../tests/role.data';

export const RoleService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(roleData()),
  findAll: jest.fn().mockResolvedValue(findAllRoles()),
  findOne: jest
    .fn()
    .mockImplementation((id) =>
      id === roleData().id
        ? Promise.resolve(roleData())
        : Promise.reject(new NotFoundException()),
    ),
  update: jest
    .fn()
    .mockImplementation((id) =>
      id === roleData().id
        ? Promise.resolve(roleData())
        : Promise.reject(new Error(`Role with id ${id} not found.`)),
    ),
  remove: jest
    .fn()
    .mockImplementation((id) =>
      id === roleData().id
        ? Promise.resolve('Promise resolves with void')
        : Promise.reject(new Error(`Role with id ${id} not found.`)),
    ),
});
