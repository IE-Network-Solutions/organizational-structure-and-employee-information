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

describe('RoleService', () => {
  let roleService: RoleService;
  let roleRepository: MockProxy<Repository<Role>>;
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
          provide: roleToken,
          useValue: mock<Repository<Role>>(),
        },
      ],
    }).compile();

    roleService = moduleRef.get<RoleService>(RoleService);
    roleRepository = moduleRef.get(roleToken);
    paginationService = moduleRef.get(PaginationService);
  });

  describe('create', () => {
    describe('when create is called', () => {
      let role: Role;

      beforeEach(() => {
        roleRepository.create.mockReturnValue(roleData());
        roleRepository.save.mockResolvedValue(roleData());
      });

      it('should call roleRepository.create', async () => {
        await roleService.create(createRole());
        expect(roleRepository.create).toHaveBeenCalledWith(createRole());
      });

      it('should call roleRepository.save', async () => {
        await roleService.create(createRole());
        expect(roleRepository.save).toHaveBeenCalledWith(roleData());
      });
      it('should return the created role', async () => {
        role = await roleService.create(createRole());
        expect(role).toEqual(roleData());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let role: Role;
      beforeEach(async () => {
        role = await roleService.findOne(roleData().id);
        roleRepository.findOne.mockResolvedValue(roleData());
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
        await roleService.findAll(paginationOptions(), searchFilter());
      });

      it('should return paginated roles', async () => {
        const permissions = await roleService.findAll(
          paginationOptions(),
          searchFilter(),
        );
        expect(permissions).toEqual(findAllRoles());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let role: Role;

      beforeEach(async () => {
        roleRepository.findOneOrFail.mockResolvedValue(roleData());
        role = await roleService.update(roleData().id, roleData());
      });

      it('should call roleRepository.findOne initially', async () => {
        expect(roleRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: roleData().id },
        });
      });

      it('should call roleRepository.update', async () => {
        expect(roleRepository.update).toHaveBeenCalledWith(roleData().id, {
          name: roleData().name,
          description: roleData().description,
        });
      });

      it('should call roleRepository.findOne again to return the updated role', async () => {
        await roleService.update(roleData().id, roleData());
        expect(roleRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: roleData().id },
        });
      });

      it('should return the updated role', async () => {
        expect(await roleService.update(roleData().id, roleData())).toEqual(
          roleData(),
        );
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        roleRepository.findOneOrFail.mockResolvedValue(roleData());
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
