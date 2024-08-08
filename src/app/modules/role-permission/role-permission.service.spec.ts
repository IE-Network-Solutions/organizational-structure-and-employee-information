import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';

import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { RolePermissionService } from './role-permission.service';
import { RolePermission } from './entities/role-permission.entity';
import {
  createRolePermissionData,
  deleteRolePermissionData,
  paginationResultRolePermissionData,
  rolePermissionData,
  rolePermissionDataSave,
} from './tests/role-permission.data';

describe('RolePermissionService', () => {
  let rolePermissionService: RolePermissionService;
  let rolePermissionRepository: MockProxy<Repository<RolePermission>>;
  let paginationService: MockProxy<PaginationService>;
  const rolePermissionToken = getRepositoryToken(RolePermission);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RolePermissionService,
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
        {
          provide: rolePermissionToken,
          useValue: mock<Repository<RolePermission>>(),
        },
      ],
    }).compile();

    rolePermissionService = moduleRef.get<RolePermissionService>(
      RolePermissionService,
    );
    rolePermissionRepository = moduleRef.get(rolePermissionToken);
    paginationService = moduleRef.get(PaginationService);
  });

  describe('create', () => {
    describe('when create is called', () => {
      beforeEach(() => {
        rolePermissionRepository.create.mockReturnValue(
          createRolePermissionData() as any,
        );
        rolePermissionRepository.save.mockResolvedValue(
          rolePermissionDataSave() as any,
        );
      });

      it('should call rolePermissionRepository.create', async () => {
        await rolePermissionService.createRoleWithPermissions(
          createRolePermissionData().roleId,
          createRolePermissionData().permissionId,
        );
      });

      it('should call rolePermissionRepository.save', async () => {
        await rolePermissionService.createRoleWithPermissions(
          createRolePermissionData().roleId,
          createRolePermissionData().permissionId,
        );
        expect(rolePermissionRepository.save).toHaveBeenCalledWith([
          createRolePermissionData(),
        ]);
      });

      it('should return the created role', async () => {
        expect(
          await rolePermissionService.createRoleWithPermissions(
            createRolePermissionData().roleId,
            createRolePermissionData().permissionId,
          ),
        ).toEqual(rolePermissionDataSave());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let rolePermission: RolePermission;

      beforeEach(async () => {
        rolePermission = await rolePermissionService.findOne(
          rolePermissionData().id,
        );
        rolePermissionRepository.findOneOrFail.mockResolvedValue(
          rolePermissionDataSave() as any,
        );
      });

      it('should call rolePermissionRepository.findOne', async () => {
        await rolePermissionService.findOne(rolePermissionData().id);
        expect(rolePermissionRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: rolePermissionData().id },
        });
      });

      it('should return the role-permission', async () => {
        expect(
          await rolePermissionService.findOne(rolePermissionData().id),
        ).toEqual(rolePermissionDataSave());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAllUsers is called', () => {
      beforeEach(async () => {
        paginationService.paginate.mockResolvedValue(
          paginationResultRolePermissionData(),
        );
        const queryBuilderMock = {
          leftJoinAndSelect: jest.fn().mockReturnThis(),
        };
        rolePermissionRepository.createQueryBuilder.mockReturnValue(
          queryBuilderMock as any,
        );
      });

      it('should call paginationService.paginate with correct parameters', async () => {
        await rolePermissionService.findAll(paginationOptions());
        expect(paginationService.paginate).toHaveBeenCalledWith(
          expect.objectContaining({
            leftJoinAndSelect: expect.any(Function),
          }),
          {
            page: paginationOptions().page,
            limit: paginationOptions().limit,
          },
        );
      });
      it('should return paginated permissions', async () => {
        const users = await rolePermissionService.findAll(paginationOptions());
        expect(users).toEqual(paginationResultRolePermissionData());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        rolePermissionRepository.findOneOrFail.mockResolvedValue(
          rolePermissionDataSave() as any,
        );
        rolePermissionRepository.softDelete.mockResolvedValue(
          deleteRolePermissionData(),
        );
      });

      it('should call rolePermissionRepository.findOne', async () => {
        await rolePermissionService.remove(rolePermissionData().id);
        expect(rolePermissionRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: rolePermissionData().id },
        });
      });

      it('should call rolePermissionRepository.delete', async () => {
        await rolePermissionService.remove(rolePermissionData().id);
        expect(rolePermissionRepository.softDelete).toHaveBeenCalledWith(
          rolePermissionData().id,
        );
      });

      it('should return void when the role is removed', async () => {
        const result = await rolePermissionService.remove(
          rolePermissionData().id,
        );
        expect(result).toEqual(deleteRolePermissionData());
      });
    });
  });
});
