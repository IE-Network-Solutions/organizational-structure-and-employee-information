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
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenantId',
        } as any;
        (roleService.create as jest.Mock).mockResolvedValue(roleData());
        role = await roleController.create(request, createRole());
      });

      test('then it should call roleService.create with correct parameters', () => {
        expect(roleService.create).toHaveBeenCalledWith(request['tenantId'], createRole());
      });

      test('then it should return a role', () => {
        expect(role).toEqual(roleData());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let request: Request;

      beforeEach(async () => {
        // Mock request object with tenantId
        request = {
          tenantId: 'tenantId', // Mock tenantId
        } as any;

        (roleService.findAll as jest.Mock).mockResolvedValue(findAllRoles());

        await roleController.findAll(request, paginationOptions(), searchFilter());
      });

      test('then it should call roleService.findAll with correct parameters', () => {
        expect(roleService.findAll).toHaveBeenCalledWith(
          paginationOptions(),
          searchFilter(),
          request['tenantId'],
        );
      });

      test('then it should return all roles', async () => {
        const result = await roleController.findAll(request, paginationOptions(), searchFilter());
        expect(result).toEqual(findAllRoles());
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
      let request: Request;

      beforeEach(async () => {
        request = {
          tenantId: 'tenantId',
        } as any;

        (roleService.update as jest.Mock).mockResolvedValue(roleData());

        role = await roleController.update(
          request,
          roleData().id,
          updateRoleDto,
        );
      });

      test('then it should call roleService.update with correct parameters', () => {
        expect(roleService.update).toHaveBeenCalledWith(
          roleData().id,
          updateRoleDto,
          request['tenantId'],
        );
      });

      test('then it should return the updated role', () => {
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
