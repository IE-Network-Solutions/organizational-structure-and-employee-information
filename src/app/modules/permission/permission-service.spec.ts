import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { PermissionService } from './permission.service';
import { MockProxy, mock } from 'jest-mock-extended';
import { Permission } from './entities/permission.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import {
  createPermission,
  deletePermission,
  findAllPermissions,
  permissionData,
  updatePermissionData,
} from './tests/permission.data';
import { searchFilter } from '@root/dist/core/commonTestData/search-filter.data';
import { paginationOptions } from '@root/dist/core/commonTestData/commonTest.data';

describe('PermissionService', () => {
  let permissionService: PermissionService;
  let permissionRepository: MockProxy<Repository<Permission>>;
  let paginationService: MockProxy<PaginationService>;
  const permissionToken = getRepositoryToken(Permission);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
        {
          provide: permissionToken,
          useValue: mock<Repository<Permission>>(),
        },
      ],
    }).compile();

    permissionService = moduleRef.get<PermissionService>(PermissionService);
    permissionRepository = moduleRef.get(permissionToken);
    paginationService = moduleRef.get(PaginationService);
  });

  describe('create', () => {
    describe('when createPermission is called', () => {
      let permission: Permission;
      beforeEach(async () => {
        await permissionRepository.create.mockReturnValue(permissionData());
        permissionRepository.save.mockResolvedValue(permissionData());
      });

      it('should call permissionRepository.create', async () => {
        permission = await permissionService.create(createPermission());
        expect(permissionRepository.create).toHaveBeenCalledWith(
          createPermission(),
        );
      });

      it('should call permissionRepository.save', async () => {
        await permissionService.create(createPermission());
        expect(permissionRepository.save).toHaveBeenCalledWith(
          permissionData(),
        );
      });

      it('should return the created permission', async () => {
        permission = await permissionService.create(createPermission());
        expect(permission).toEqual(permissionData());
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let permission: Permission;

      beforeEach(async () => {
        permissionRepository.findOneOrFail.mockResolvedValue(permissionData());
        permission = await permissionService.findOne(permissionData().id);
      });

      it('should call permissionRepository.findOne', async () => {
        await permissionService.findOne(permissionData().id);
        expect(permissionRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: permissionData().id },
        });
      });

      it('should return the client', () => {
        expect(permission).toEqual(permissionData());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      beforeEach(async () => {
        paginationService.paginate.mockResolvedValue(findAllPermissions());
      });

      it('should call paginationService.paginate with correct parameters', async () => {
        await permissionService.findAll(paginationOptions(), searchFilter());
        // expect(paginationService.paginate).toHaveBeenCalledWith(permissionRepository, 'permission',
        //   {
        //     page: paginationOptions().page,
        //     limit: paginationOptions().limit,
        //   },
        //   paginationOptions().orderBy,
        //   paginationOptions().orderDirection,
        // );
      });

      it('should return paginated permissions', async () => {
        const permissions = await permissionService.findAll(
          paginationOptions(),
          searchFilter(),
        );
        expect(permissions).toEqual(findAllPermissions());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let permission: Permission;
      beforeEach(async () => {
        permissionRepository.findOneOrFail.mockResolvedValue(permissionData());
        permission = await permissionService.update(
          permissionData().id,
          updatePermissionData(),
        );
      });

      it('should call permissionRepository.findOne', async () => {
        expect(permissionRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: permissionData().id },
        });
      });

      it('should call permissionRepository.update', async () => {
        expect(permissionRepository.update).toHaveBeenCalledWith(
          { id: permissionData().id },
          updatePermissionData(),
        );
      });

      it('should call permisionRepository.findOne again to return the updated permission', async () => {
        expect(permissionRepository.findOneOrFail).toHaveBeenCalledTimes(2);
        expect(permissionRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: permissionData().id },
        });
      });

      it('should return the updated permission', () => {
        expect(permission).toEqual(permissionData());
      });
    });
  });

  describe('remove', () => {
    describe('when PermissionSerice class is called', () => {
      beforeEach(async () => {
        permissionRepository.findOneOrFail.mockResolvedValue(permissionData());
        permissionRepository.softDelete.mockResolvedValue(deletePermission());
      });

      it('should call permissionRepository.findOne', async () => {
        await permissionService.remove(permissionData().id);
        expect(permissionRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: permissionData().id },
        });
      });

      it('should call PermissionRepository.delete', async () => {
        await permissionService.remove(permissionData().id);
        expect(permissionRepository.softDelete).toHaveBeenCalledWith(
          permissionData().id,
        );
      });
      it('should return void when the permission is removed', async () => {
        const result = await permissionService.remove(permissionData().id);
        expect(result).toEqual(deletePermission());
      });
    });
  });
});
