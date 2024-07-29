import { Test } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { createRole, findAllRoles, roleData } from './tests/role.data';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { searchFilter } from '@root/src/core/commonTestData/search-filter.data';

jest.mock('./role.service');

describe('RoleController', () => {
  let roleController: RoleController;
  let roleService: RoleService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [RoleController],
      providers: [RoleService],
    }).compile();

    roleController = moduleRef.get<RoleController>(RoleController);
    roleService = moduleRef.get<RoleService>(RoleService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let role: Role;
      beforeEach(async () => {
        role = await roleController.create(createRole());
      });

      test('then it should call roleService', () => {
        expect(roleService.create).toHaveBeenCalledWith(createRole());
      });

      test('then it should return a role', () => {
        expect(role).toEqual(roleData());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      beforeEach(async () => {
        await roleController.findAll(paginationOptions(), searchFilter());
      });

      test('then it should call RoleService class', () => {
        expect(roleService.findAll).toHaveBeenCalledWith(
          paginationOptions(),
          searchFilter(),
        );
      });

      test('then is should return all roles', async () => {
        expect(await roleController.findAll()).toEqual(findAllRoles());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let role: Role;

      beforeEach(async () => {
        role = await roleController.findOne(roleData().id);
      });

      test('then it should call roleService', () => {
        expect(roleService.findOne).toHaveBeenCalledWith(roleData().id);
      });

      test('then it should return role', () => {
        expect(role).toEqual(roleData());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let role: Role;
      let updateRoleDto: UpdateRoleDto;

      beforeEach(async () => {
        updateRoleDto = {
          name: 'Admin role',
          description: 'Description for update admin role',
        };
        role = await roleController.update(roleData().id, updateRoleDto);
      });

      test('then it should call roleService', () => {
        expect(roleService.update).toHaveBeenCalledWith(
          roleData().id,
          updateRoleDto,
        );
      });

      test('then it should return a role', () => {
        expect(role).toEqual(roleData());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        await roleController.remove(roleData().id);
      });

      test('then it should call remove', () => {
        expect(roleService.remove).toHaveBeenCalledWith(roleData().id);
      });

      test('then it should return a role', async () => {
        expect(await roleController.remove(roleData().id)).toEqual(
          'Promise resolves with void',
        );
      });
    });
  });
});
