import { NotFoundException } from '@nestjs/common';
import {
  paginationResultUserPermissionData,
  userPermissionData,
} from '../tests/user-permission.data';

export const UserPermissionService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(userPermissionData()),
  findAll: jest.fn().mockResolvedValue(paginationResultUserPermissionData()),
  findOne: jest
    .fn()
    .mockImplementation((id) =>
      id === userPermissionData().id
        ? Promise.resolve(userPermissionData())
        : Promise.reject(new NotFoundException()),
    ),
  update: jest
    .fn()
    .mockImplementation((id) =>
      id === userPermissionData().id
        ? Promise.resolve(userPermissionData())
        : Promise.reject(new Error(`User-Permission with id ${id} not found.`)),
    ),
  remove: jest
    .fn()
    .mockImplementation((id) =>
      id === userPermissionData().id
        ? Promise.resolve('Promise resolves with void')
        : Promise.reject(new Error(`User-Permission with id ${id} not found.`)),
    ),
});
