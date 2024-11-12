import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';

import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import {
  createRole,
  deleteRole,
  findAllRoles,
  roleData,
} from './tests/role.data';

import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { searchFilter } from '@root/src/core/commonTestData/search-filter.data';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { CreateRoleDto } from './dto/create-role.dto';

describe('RoleService', () => {
  let roleService: RoleService;
  let roleRepository: MockProxy<Repository<Role>>;
  let rolePermissionService: MockProxy<RolePermissionService>;
  let paginationService: MockProxy<PaginationService>;
  const roleToken = getRepositoryToken(Role);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
        {
          provide: RolePermissionService,
          useValue: mock<RolePermissionService>(),
        },
        {
          provide: roleToken,
          useValue: mock<Repository<Role>>(),
        },
      ],
    }).compile();

    roleService = moduleRef.get<RoleService>(RoleService);
    rolePermissionService = moduleRef.get(RolePermissionService);
    roleRepository = moduleRef.get(roleToken);
    paginationService = moduleRef.get(PaginationService);
  });

  describe('create', () => {
    describe('when create is called', () => {
      let role: Role;
      let createRoleDto: CreateRoleDto;

      beforeEach(async () => {
        createRoleDto = createRole();

        roleRepository.create.mockReturnValue(roleData() as any);
        roleRepository.save.mockResolvedValue(roleData() as any);
        rolePermissionService.createRoleWithPermissions.mockResolvedValue(
          undefined,
        );
      });

      it('should call roleRepository.create', async () => {
        await roleService.create(roleData().tenantId, createRoleDto);
        expect(roleRepository.create).toHaveBeenCalledWith({
          tenantId: roleData().tenantId,
          ...createRoleDto,
        });
      });

      it('should call roleRepository.save', async () => {
        await roleService.create(roleData().tenantId, createRoleDto);
        expect(roleRepository.save).toHaveBeenCalledWith(roleData());
      });

      it('should call rolePermissionService.createRoleWithPermissions', async () => {
        await roleService.create(roleData().tenantId, createRoleDto);
        expect(
          rolePermissionService.createRoleWithPermissions,
        ).toHaveBeenCalledWith(
          roleData().id,
          createRoleDto.permission,
          roleData().tenantId,
        );
      });

      it('should return the created role', async () => {
        role = await roleService.create(roleData().tenantId, createRoleDto);
        expect(role).toEqual(roleData());
      });
    });
  });
  describe('findOne', () => {
    describe('when findOne is called', () => {
      let role: Role;
      beforeEach(async () => {
        role = await roleService.findOne(roleData().id);
        roleRepository.findOne.mockResolvedValue(roleData().id as any);
      });

      it('should call roleRepository.findOne', async () => {
        await roleService.findOne(roleData().id);
        expect(roleRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: roleData().id },
        });
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      beforeEach(async () => {
        paginationService.paginate.mockResolvedValue(findAllRoles());
      });

      it('should call paginationService.paginate with correct parameters', async () => {
        await roleService.findAll(
          paginationOptions(),
          searchFilter(),
          roleData().tenantId,
        );
      });

      it('should return paginated roles', async () => {
        const permissions = await roleService.findAll(
          paginationOptions(),
          searchFilter(),
          roleData().tenantId,
        );
        expect(permissions).toEqual(findAllRoles());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      beforeEach(async () => {
        roleRepository.findOneOrFail.mockResolvedValue(roleData() as any); // Mock the initial find
        roleRepository.update.mockResolvedValue({
          raw: [],
          generatedMaps: [],
          affected: 1,
        }); // Mock the update
        roleRepository.findOneOrFail.mockResolvedValue(roleData() as any); // Mock the final find

        await roleService.update(
          roleData().id,
          roleData(),
          roleData().tenantId,
        );
      });

      it('should call roleRepository.findOneOrFail initially', async () => {
        expect(roleRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: roleData().id },
        });
      });

      it('should call roleRepository.update with correct parameters', async () => {
        expect(roleRepository.update).toHaveBeenCalledWith(roleData().id, {
          name: roleData().name,
          description: roleData().description,
        });
      });

      it('should call roleRepository.findOneOrFail again to return the updated role', async () => {
        expect(roleRepository.findOneOrFail).toHaveBeenCalledTimes(2); // Ensure it was called twice
        expect(roleRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: roleData().id },
        });
      });

      it('should return the updated role', async () => {
        const result = await roleService.update(
          roleData().id,
          roleData(),
          roleData().tenantId,
        );
        expect(result).toEqual(roleData());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        roleRepository.findOneOrFail.mockResolvedValue(roleData() as any);
        roleRepository.softDelete.mockResolvedValue(deleteRole());
      });

      it('should call roleRepository.findOne', async () => {
        await roleService.remove(roleData().id);
        expect(roleRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: roleData().id },
        });
      });

      it('should call roleRepository.delete', async () => {
        await roleService.remove(roleData().id);
        expect(roleRepository.softDelete).toHaveBeenCalledWith(roleData().id);
      });

      it('should return void when the role is removed', async () => {
        const result = await roleService.remove(roleData().id);
        expect(result).toEqual(deleteRole());
      });
    });
  });
});
