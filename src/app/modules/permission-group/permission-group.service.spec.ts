import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PermissionGroupService } from './permission-group.service';
import { PermissionGroup } from './entities/permission-group.entity';
import { Repository } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { PermissionService } from '../permission/permission.service';
import {
  createPermissionGroup,
  deletepermissionGroup,
  findAllPermissionGroups,
  permissionGroupData,
} from './tests/permission-group.data';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { searchFilter } from '@root/src/core/commonTestData/search-filter.data';

describe('PermissionGroupService', () => {
  let permissionGroupService: PermissionGroupService;
  let permissionGroupRepository: MockProxy<Repository<PermissionGroup>>;
  let paginationService: MockProxy<PaginationService>;
  const permissionGroupToken = getRepositoryToken(PermissionGroup);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PermissionGroupService,

        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
        {
          provide: PermissionService,
          useValue: mock<PermissionService>(),
        },
        {
          provide: permissionGroupToken,
          useValue: mock<Repository<PermissionGroup>>(),
        },
      ],
    }).compile();

    permissionGroupService = moduleRef.get<PermissionGroupService>(
      PermissionGroupService,
    );
    permissionGroupRepository = moduleRef.get(permissionGroupToken);
    paginationService = moduleRef.get(PaginationService);
  });

  describe('create', () => {
    describe('when create is called', () => {
      let permissionGroup: PermissionGroup;

      beforeEach(() => {
        permissionGroupRepository.create.mockReturnValue(permissionGroupData());
        permissionGroupRepository.save.mockResolvedValue(permissionGroupData());
      });

      it('should call permissionGroupRepository.create', async () => {
        await permissionGroupService.create(createPermissionGroup());
        expect(permissionGroupRepository.create).toHaveBeenCalledWith(
          createPermissionGroup(),
        );
      });

      it('should call permissionGroupRepository.save', async () => {
        await permissionGroupService.create(createPermissionGroup());
        expect(permissionGroupRepository.save).toHaveBeenCalledWith(
          permissionGroupData(),
        );
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let permissionGroup: PermissionGroup;

      beforeEach(async () => {
        permissionGroupRepository.findOneOrFail.mockResolvedValue(
          permissionGroupData() as any,
        );
        permissionGroup = await permissionGroupService.findOne(
          permissionGroupData().id,
        );
      });

      it('should call permissionGroupRepository.findOne', async () => {
        await permissionGroupService.findOne(permissionGroupData().id);
        expect(permissionGroupRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: permissionGroupData().id },
          relations: ['permission'],
        });
      });

      it('should return the permission group', () => {
        expect(permissionGroup).toEqual(permissionGroupData());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let mockQueryBuilder: any;

      beforeEach(() => {
        mockQueryBuilder = {
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockReturnValue(findAllPermissionGroups().items),
        };

        permissionGroupRepository.createQueryBuilder.mockReturnValue(
          mockQueryBuilder,
        );

        paginationService.paginate.mockResolvedValue(findAllPermissionGroups());
      });

      it('should call paginationService.paginate with correct parameters', async () => {
        await permissionGroupService.findAll(
          paginationOptions(),
          searchFilter(),
        );
      });

      it('should return paginated permission groups', async () => {
        const result = await permissionGroupService.findAll(
          paginationOptions(),
          searchFilter(),
        );

        expect(result).toEqual(findAllPermissionGroups());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let permissionGroup: PermissionGroup;
      beforeEach(async () => {
        permissionGroupRepository.findOneOrFail.mockResolvedValue(
          permissionGroupData(),
        );

        permissionGroup = await permissionGroupService.update(
          permissionGroupData().id,
          createPermissionGroup(),
        );
      });

      it('should call permissionGroupRepository.findOne initially', async () => {
        expect(permissionGroupRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: permissionGroupData().id },
          relations: ['permission'],
        });
      });

      it('should call permissionGroupRepository.findOne again to return the updated permission group', async () => {
        await permissionGroupService.update(
          permissionGroupData().id,
          createPermissionGroup(),
        );

        expect(permissionGroupRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: permissionGroupData().id },
          relations: ['permission'],
        });
      });
    });
  });
  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        permissionGroupRepository.findOneOrFail.mockResolvedValue(
          permissionGroupData(),
        );
        permissionGroupRepository.softDelete.mockResolvedValue(
          deletepermissionGroup(),
        );
      });

      it('should call permissionGroupRepository.delete', async () => {
        await permissionGroupService.remove(permissionGroupData().id);
        expect(permissionGroupRepository.softDelete).toHaveBeenCalledWith(
          permissionGroupData().id,
        );
      });
      it('should return void when the permission group is removed', async () => {
        const result = await permissionGroupService.remove(
          permissionGroupData().id,
        );
        expect(result).toEqual(deletepermissionGroup());
      });
    });
  });
});
