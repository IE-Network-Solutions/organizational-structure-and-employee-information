import { NotFoundException } from '@nestjs/common';
import {
  findAllPermissionGroups,
  permissionGroupData,
} from '../tests/permission-group.data';

export const PermissionGroupService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(permissionGroupData()),
  findAll: jest.fn().mockResolvedValue(findAllPermissionGroups()),
  findOne: jest
    .fn()
    .mockImplementation((id) =>
      id === permissionGroupData().id
        ? Promise.resolve(permissionGroupData())
        : Promise.reject(new NotFoundException()),
    ),
  update: jest
    .fn()
    .mockImplementation((id) =>
      id === permissionGroupData().id
        ? Promise.resolve(permissionGroupData())
        : Promise.reject(
            new Error(`Permission group with id ${id} not found.`),
          ),
    ),
  remove: jest
    .fn()
    .mockImplementation((id) =>
      id === permissionGroupData().id
        ? Promise.resolve('Promise resolves with void')
        : Promise.reject(
            new Error(`Permission group with id ${id} not found.`),
          ),
    ),
});
