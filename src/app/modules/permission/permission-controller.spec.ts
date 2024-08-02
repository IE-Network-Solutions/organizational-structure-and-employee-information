import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { Test } from '@nestjs/testing';
import { Permission } from './entities/permission.entity';
import {
  createPermission,
  findAllPermissions,
  permissionData,
  updatePermissionData,
} from './tests/permission.data';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { searchFilter } from '@root/src/core/commonTestData/search-filter.data';

jest.mock('./permission.service');

describe('PermissionController', () => {
  let permissionController: PermissionController;
  let permissionService: PermissionService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [PermissionController],
      providers: [PermissionService],
    }).compile();

    permissionController =
      moduleRef.get<PermissionController>(PermissionController);
    permissionService = moduleRef.get<PermissionService>(PermissionService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create permission method is called', () => {
      let permissions: Permission;

      beforeEach(async () => {
        permissions = await permissionController.create(createPermission());
      });

      test('then it should call permissionService class', () => {
        expect(permissionService.create).toHaveBeenCalledWith(
          createPermission(),
        );
      });

      test('then it should return a permission', () => {
        expect(permissions).toEqual(permissionData());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let permission: Permission;

      beforeEach(async () => {
        permission = await permissionController.findOne(permissionData().id);
      });

      test('then it should call PermissionService class', () => {
        expect(permissionService.findOne).toHaveBeenCalledWith(
          permissionData().id,
        );
      });

      test('then it should return permission', () => {
        expect(permission).toEqual(permissionData());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      beforeEach(async () => {
        await permissionController.findAll(paginationOptions(), searchFilter());
      });

      test('then it should call PermissionService class', () => {
        expect(permissionService.findAll).toHaveBeenCalledWith(
          paginationOptions(),
          searchFilter(),
        );
      });

      test('then is should return all permissions', async () => {
        expect(await permissionController.findAll()).toEqual(
          findAllPermissions(),
        );
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let permission: Permission;

      beforeEach(async () => {
        permission = await permissionController.update(
          permissionData().id,
          updatePermissionData(),
        );
      });

      test('then it should call PermissionService class', () => {
        expect(permissionService.update).toHaveBeenCalledWith(
          permissionData().id,
          updatePermissionData(),
        );
      });

      test('then it should return a permission', () => {
        expect(permission).toEqual(permissionData());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        await permissionController.findOne(permissionData().id);
      });
      beforeEach(async () => {
        await permissionController.remove(permissionData().id);
      });

      test('then it should call PermissionService class', () => {
        expect(permissionService.remove).toHaveBeenCalledWith(
          permissionData().id,
        );
      });

      test('then it should return a permission', async () => {
        expect(await permissionController.remove(permissionData().id)).toEqual(
          'Promise resolves with void',
        );
      });
    });
  });
});
