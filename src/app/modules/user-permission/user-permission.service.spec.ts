import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';

import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { UserPermissionService } from './user-permission.service';
import { UserPermission } from './entities/user-permission.entity';
import {
  deleteUserPermissionData,
  paginationResultUserPermissionData,
  userPermissionData,
  userPermissionDataSave,
} from './tests/user-permission.data';

describe('UserPermissionService', () => {
  let userPermissionService: UserPermissionService;
  let userPermissionRepository: MockProxy<Repository<UserPermission>>;
  let paginationService: MockProxy<PaginationService>;
  const userPermissionToken = getRepositoryToken(UserPermission);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserPermissionService,
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },
        {
          provide: userPermissionToken,
          useValue: mock<Repository<UserPermission>>(),
        },
      ],
    }).compile();

    userPermissionService = moduleRef.get<UserPermissionService>(
      UserPermissionService,
    );
    userPermissionRepository = moduleRef.get(userPermissionToken);
    paginationService = moduleRef.get(PaginationService);
  });

  // describe('create', () => {
  //   describe('when create is called', () => {
  //     beforeEach(() => {
  //       userPermissionRepository.create.mockReturnValue(
  //         createUserPermissionData() as any,
  //       );
  //       userPermissionRepository.save.mockResolvedValue(
  //         userPermissionDataSave() as any,
  //       );
  //     });

  //     it('should call userPermissionRepository.create', async () => {
  //       await userPermissionService.assignPermissionToUser(
  //         createUserPermissionData() as any, userPermissionDataSave().tenantId,
  //       );
  //       expect(userPermissionRepository.create).toHaveBeenCalledWith(
  //         createUserPermission(),
  //       );
  //     });

  //     it('should call userPermissionRepository.save', async () => {
  //       await userPermissionService.assignPermissionToUser(
  //         createUserPermissionData() as any, userPermissionDataSave().tenantId,
  //       );
  //       expect(userPermissionRepository.save).toHaveBeenCalledWith([
  //         createUserPermissionData(),
  //       ]);
  //     });

  //     it('should return the created role', async () => {
  //       await userPermissionService.assignPermissionToUser(
  //         createUserPermissionData() as any, userPermissionDataSave().tenantId
  //       );
  //       expect(
  //         await userPermissionService.assignPermissionToUser(
  //           createUserPermissionData() as any, userPermissionDataSave().tenantId
  //         ),
  //       ).toEqual(userPermissionDataSave());
  //     });
  //   });
  // });

  // describe('findOne', () => {
  //   describe('when findOne is called', () => {
  //     let userPermission: UserPermission;

  //     beforeEach(async () => {
  //       userPermission = await userPermissionService.findOne(
  //         userPermissionData().id,
  //       );
  //       userPermissionRepository.findOneOrFail.mockResolvedValue(
  //         userPermissionDataSave().id as any
  //       );
  //     });

  //     it('should call userPermissionRepository.findOne', async () => {
  //       await userPermissionService.findOne(userPermissionData().id);
  //       expect(userPermissionRepository.findOneOrFail).toHaveBeenCalledWith({
  //         where: { id: userPermissionData().id },
  //       });
  //     });

  //     it('should return the user-permission', async () => {
  //       expect(
  //         await userPermissionService.findOne(userPermissionData().id),
  //       ).toEqual(userPermissionDataSave());
  //     });
  //   });
  // });
  describe('findAll', () => {
    describe('when findAllUsers is called', () => {
      beforeEach(async () => {
        paginationService.paginate.mockResolvedValue(
          paginationResultUserPermissionData(),
        );
        const queryBuilderMock = {
          leftJoinAndSelect: jest.fn().mockReturnThis(),
        };
        userPermissionRepository.createQueryBuilder.mockReturnValue(
          queryBuilderMock as any,
        );
      });

      it('should call paginationService.paginate with correct parameters', async () => {
        await userPermissionService.findAll(paginationOptions());
        expect(paginationService.paginate).toHaveBeenCalledWith(
          // Ensure to use the mocked queryBuilder correctly
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
        const users = await userPermissionService.findAll(paginationOptions());
        expect(users).toEqual(paginationResultUserPermissionData());
      });
    });
  });
  // describe('update', () => {
  //   describe('when update is called', () => {
  //     let userPermission: UserPermission;

  //     beforeEach(async () => {
  //       userPermissionRepository.findOneOrFail.mockResolvedValue(
  //         userPermissionDataSave().id as any,
  //       );
  //       userPermissionRepository.update.mockResolvedValue(
  //         updateUserPermissionData(),
  //       );
  //       userPermission = await userPermissionService.update(
  //         userPermissionData().id,
  //         userPermissionData(),
  //       );
  //     });

  //     it('should call userPermissionRepository.findOne initially', async () => {
  //       expect(userPermissionRepository.findOneOrFail).toHaveBeenCalledWith({
  //         where: { id: userPermissionData().id },
  //       });
  //     });

  //     it('should call userPermissionRepository.save', async () => {
  //       expect(userPermissionRepository.save).toHaveBeenCalledWith(
  //         createUserPermission(),
  //       );
  //     });

  //     it('should call userPermissionRepository.findOne again to return the updated role', async () => {
  //       await userPermissionService.update(
  //         userPermissionData().id,
  //         userPermissionData(),
  //       );
  //       expect(userPermissionRepository.findOneOrFail).toHaveBeenCalledWith({
  //         where: { id: userPermissionData().id },
  //       });
  //     });

  //     it('should return the updated role', () => {
  //       expect(userPermission).toEqual(userPermissionDataSave());
  //     });
  //   });
  // });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        userPermissionRepository.findOneOrFail.mockResolvedValue(
          userPermissionDataSave().id as any,
        );
        userPermissionRepository.softDelete.mockResolvedValue(
          deleteUserPermissionData(),
        );
      });

      it('should call userPermissionRepository.findOne', async () => {
        await userPermissionService.remove(userPermissionData().id);
        expect(userPermissionRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: userPermissionData().id },
        });
      });

      it('should call userPermissionRepository.delete', async () => {
        await userPermissionService.remove(userPermissionData().id);
        expect(userPermissionRepository.softDelete).toHaveBeenCalledWith(
          userPermissionData().id,
        );
      });

      it('should return void when the role is removed', async () => {
        const result = await userPermissionService.remove(
          userPermissionData().id,
        );
        expect(result).toEqual(deleteUserPermissionData());
      });
    });
  });
});
