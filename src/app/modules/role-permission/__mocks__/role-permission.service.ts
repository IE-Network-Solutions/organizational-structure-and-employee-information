import { NotFoundException } from '@nestjs/common';
import {
  paginationResultRolePermissionData,
  rolePermissionData,
} from '../tests/role-permission.data';

export const RoleService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(rolePermissionData()),
  findAll: jest.fn().mockResolvedValue(paginationResultRolePermissionData()),
  findOne: jest
    .fn()
    .mockImplementation((id) =>
      id === rolePermissionData().id
        ? Promise.resolve(rolePermissionData())
        : Promise.reject(new NotFoundException()),
    ),
  update: jest
    .fn()
    .mockImplementation((id) =>
      id === rolePermissionData().id
        ? Promise.resolve(rolePermissionData())
        : Promise.reject(new Error(`Role-Permission with id ${id} not found.`)),
    ),
  remove: jest
    .fn()
    .mockImplementation((id) =>
      id === rolePermissionData().id
        ? Promise.resolve('Promise resolves with void')
        : Promise.reject(new Error(`Role-Permission with id ${id} not found.`)),
    ),
});
