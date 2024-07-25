import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';

import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import {
  createRoleData,
  deleteRoleData,
  paginationResultRoleData,
  roleData,
  roleDataSave,
  updateRoleData,
} from './tests/role.data';
import * as applySearchFilterUtils from '../../../core/utils/search-filter.utils'; // Adjust the path to the correct module

import { RolePermissionService } from '../role-permission/role-permission.service';
import { rolePermissionReturnedData } from '../role-permission/tests/role-permission.data';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';

describe('RoleService', () => {
  let roleService: RoleService;
  let roleRepository: MockProxy<Repository<Role>>;
  let paginationService: MockProxy<PaginationService>;
  let rolePermissionService: MockProxy<RolePermissionService>;
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

      beforeEach(() => {
        roleRepository.create.mockReturnValue(createRoleData() as any);
        roleRepository.save.mockResolvedValue(roleDataSave());
        rolePermissionService.createRoleWithPermissions.mockResolvedValue([
          rolePermissionReturnedData(),
        ]);
      });

      it('should call roleRepository.create', async () => {
        await roleService.create(createRoleData());
        expect(roleRepository.create).toHaveBeenCalledWith(createRoleData());
      });

      it('should call roleRepository.save', async () => {
        await roleService.create(createRoleData());

        expect(roleRepository.save).toHaveBeenCalledWith(createRoleData());
      });
      it('should call  rolePermissionService.createRolePermission', async () => {
        const roleId = roleData().id;
        const permissions = createRoleData().permission;
        await rolePermissionService.createRoleWithPermissions(
          roleId,
          permissions,
        );

        expect(
          rolePermissionService.createRoleWithPermissions,
        ).toHaveBeenCalledWith(roleId, permissions);
      });

      it('should return the created role', async () => {
        role = await roleService.create(createRoleData());
        expect(role).toEqual(roleDataSave());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let role: Role;

      beforeEach(async () => {
        role = await roleService.findOne(roleData().id);
        roleRepository.findOne.mockResolvedValue(roleDataSave());
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
    beforeEach(async () => {
      paginationService.paginate.mockResolvedValue(paginationResultRoleData());

      const queryBuilderMock = {
        withDeleted: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      };
      jest
        .spyOn(roleRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      // Mock the applySearchFiltersService function
      jest
        .spyOn(applySearchFilterUtils, 'applySearchFilterUtils')
        .mockImplementation(
          async (
            queryBuilder: any,
            searchFilterDTO: SearchFilterDTO,
            repository: any,
          ) => {
            if (searchFilterDTO.columnName === 'name') {
              queryBuilder.andWhere('role.name LIKE :query', {
                query: `%${searchFilterDTO.query}%`,
              });
            }
            return queryBuilder;
          },
        );
    });

    it('should call paginationService.paginate with correct parameters', async () => {
      const paginationOptions = { page: 1, limit: 10 };
      const searchFilterDTO: SearchFilterDTO = {
        columnName: 'name',
        query: 'Admin',
      };

      await roleService.findAll(paginationOptions, searchFilterDTO);

      expect(paginationService.paginate).toHaveBeenCalledWith(
        expect.objectContaining({
          withDeleted: expect.any(Function),
        }),
        {
          page: paginationOptions.page,
          limit: paginationOptions.limit,
        },
      );
    });

    it('should call applySearchFiltersService with correct parameters', async () => {
      const paginationOptions = { page: 1, limit: 10 };
      const searchFilterDTO: SearchFilterDTO = {
        columnName: 'name',
        query: 'Admin',
      };

      const applySearchFiltersServiceSpy = jest.spyOn(
        applySearchFilterUtils,
        'applySearchFilterUtils',
      );

      await roleService.findAll(paginationOptions, searchFilterDTO);

      expect(applySearchFiltersServiceSpy).toHaveBeenCalledWith(
        expect.any(Object),
        searchFilterDTO,
        roleRepository,
      );
    });

    it('should return paginated roles', async () => {
      const paginationOptions = { page: 1, limit: 10 };
      const searchFilterDTO: SearchFilterDTO = {
        columnName: 'name',
        query: 'Admin',
      };

      const result = await roleService.findAll(
        paginationOptions,
        searchFilterDTO,
      );

      expect(result).toEqual(paginationResultRoleData());
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let role: Role;

      beforeEach(async () => {
        roleRepository.findOneOrFail.mockResolvedValue(roleDataSave());
        roleRepository.update.mockResolvedValue(updateRoleData());
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
          roleDataSave(),
        );
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        roleRepository.findOneOrFail.mockResolvedValue(roleDataSave());
        roleRepository.softDelete.mockResolvedValue(deleteRoleData());
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
        expect(result).toEqual(deleteRoleData());
      });
    });
  });
});
