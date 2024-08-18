import { Test } from '@nestjs/testing';
import { PermissionGroupController } from './permission-group.controller';
import { PermissionGroupService } from './permission-group.service';
import { PermissionGroup } from './entities/permission-group.entity';
import {
  createPermissionGroup,
  findAllPermissionGroups,
  permissionGroupData,
} from './tests/permission-group.data';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { searchFilter } from '@root/src/core/commonTestData/search-filter.data';

jest.mock('./permission-group.service');

describe('PermissionGroupController', () => {
  let permissionGroupController: PermissionGroupController;
  let permissionGroupService: PermissionGroupService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [PermissionGroupController],
      providers: [PermissionGroupService],
    }).compile();

    permissionGroupController = moduleRef.get<PermissionGroupController>(
      PermissionGroupController,
    );
    permissionGroupService = moduleRef.get<PermissionGroupService>(
      PermissionGroupService,
    );
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let permissionGroup: PermissionGroup;

      beforeEach(async () => {
        permissionGroup = await permissionGroupController.create(
          createPermissionGroup(),
        );
      });

      test('then it should call create', () => {
        expect(permissionGroupService.create).toHaveBeenCalledWith(
          createPermissionGroup(),
        );
      });

      test('then it should return a permisson group', () => {
        expect(permissionGroup).toEqual(permissionGroupData());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let permissionGroup: PermissionGroup;

      beforeEach(async () => {
        permissionGroup = await permissionGroupController.findOne(
          permissionGroupData().id,
        );
      });

      test('then it should call findOne', () => {
        expect(permissionGroupService.findOne).toHaveBeenCalledWith(
          permissionGroupData().id,
        );
      });

      test('then it should return permission group', () => {
        expect(permissionGroup).toEqual(permissionGroupData());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      beforeEach(async () => {
        await permissionGroupController.findAll(
          paginationOptions(),
          searchFilter(),
        );
      });

      test('then it should call findAll service', () => {
        expect(permissionGroupService.findAll).toHaveBeenCalledWith(
          paginationOptions(),
          searchFilter(),
        );
      });

      test('then is should return permission groups', async () => {
        expect(await permissionGroupController.findAll()).toEqual(
          findAllPermissionGroups(),
        );
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let permissionGroup: PermissionGroup;
      beforeEach(async () => {
        permissionGroup = await permissionGroupController.update(
          permissionGroupData().id,
          createPermissionGroup(),
        );
      });

      test('then it should call update', () => {
        expect(permissionGroupService.update).toHaveBeenCalledWith(
          permissionGroupData().id,
          createPermissionGroup(),
        );
      });

      test('then it should return a permission group', () => {
        expect(permissionGroup).toEqual(permissionGroupData());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        await permissionGroupController.remove(permissionGroupData().id);
      });

      test('then it should call remove', () => {
        expect(permissionGroupService.remove).toHaveBeenCalledWith(
          permissionGroupData().id,
        );
      });

      test('then it should return a permission group', async () => {
        expect(
          await permissionGroupController.remove(permissionGroupData().id),
        ).toEqual('Promise resolves with void');
      });
    });
  });
});
