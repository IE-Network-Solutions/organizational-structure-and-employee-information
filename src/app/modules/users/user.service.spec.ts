// import { Test } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';
// import { UsersService } from './users.service';
// import {
//   createUserData,
//   deleteUserData,
//   updateUserData,
//   userData,
//   userDataSave,
// } from './tests/user.data';
// import * as applySearchFilterUtils from '../../../core/utils/search-filter.utils'; // Adjust the path to the correct module

// import { MockProxy, mock } from 'jest-mock-extended';
// import { Repository } from 'typeorm';
// import { PaginationService } from '@root/src/core/pagination/pagination.service';
// // import { UserPermission } from '../user-permission/entities/user-permission.entity';
// // import { UserPermissionService } from '../user-permission/user-permission.service';
// // import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
// // import { Repository } from 'typeorm';

// describe('usersService', () => {
//   let usersService: UsersService;
//   let usersRepository: MockProxy<Repository<User>>;
//   let paginationService: MockProxy<PaginationService>;
//   // let userPermissionService: MockProxy<UserPermissionService>;
//   const userToken = getRepositoryToken(User);

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         {
//           provide: PaginationService,
//           useValue: mock<PaginationService>(), // Use mock for PaginationService
//         },

//         {
//           provide: userToken,
//           useValue: mock<Repository<User>>(),
//         },
//       ],
//     }).compile();

//     usersService = moduleRef.get<UsersService>(UsersService);
//     usersRepository = moduleRef.get(userToken);
//     paginationService = moduleRef.get(PaginationService); // Get an instance of PaginationService
//   });

//   describe('create', () => {
//     describe('when createUser is called', () => {
//       let user: User;
//       beforeEach(() => {
//         usersRepository.create.mockReturnValue(createUserData() as any);
//         usersRepository.save.mockResolvedValue(userDataSave() as any);
//       });

//       it('should call usersRepository.create', async () => {
//         await usersService.create(createUserData());
//         expect(usersRepository.create).toHaveBeenCalledWith(createUserData());
//       });

//       it('should call usersRepository.save', async () => {
//         await usersService.create(createUserData());
//         expect(usersRepository.save).toHaveBeenCalledWith(createUserData());
//       });

//       it('should return the created user', async () => {
//         user = await usersService.create(createUserData());
//         expect(user).toEqual(userDataSave());
//       });
//     });
//   });

// describe('findOne', () => {
//   describe('when findUserPermission is called', () => {
//     let user: User;

//     beforeEach(async () => {
//       usersRepository.findOne.mockResolvedValue(userDataSave() as any);
//       usersRepository.createQueryBuilder.mockReturnValue({
//         leftJoinAndSelect: jest.fn().mockReturnThis(),
//         where: jest.fn().mockReturnThis(),
//         getOne: jest.fn().mockResolvedValue(userDataSave()),
//       } as any);
//       user = await usersService.findOne(userData().id);
//     });

//     it('should call usersRepository.findOne', async () => {
//       await usersService.findOne(userData().id);
//       expect(usersRepository.findOne).toHaveBeenCalledWith({
//         where: { id: userData().id },
//       });
//     });

//     it('should call usersRepository.createQueryBuilder methods', () => {
//       expect(
//         usersRepository.createQueryBuilder().leftJoinAndSelect,
//       ).toHaveBeenCalledWith('user.role', 'role');
//       expect(
//         usersRepository.createQueryBuilder().leftJoinAndSelect,
//       ).toHaveBeenCalledWith('role.rolePermissions', 'rolePermission');
//       expect(
//         usersRepository.createQueryBuilder().leftJoinAndSelect,
//       ).toHaveBeenCalledWith('user.userPermissions', 'userPermission');
//       expect(
//         usersRepository.createQueryBuilder().leftJoinAndSelect,
//       ).toHaveBeenCalledWith('userPermission.permission', 'permission');
//       expect(usersRepository.createQueryBuilder().where).toHaveBeenCalledWith(
//         'user.id = :id',
//         { id: userData().id },
//       );
//     });

//     it('should return the user', () => {
//       expect(user).toEqual(userDataOnFindOne());
//     });
//   });
// });

// describe('findAll', () => {
//   it('should apply search filters correctly', async () => {
//     const paginationOptions = { page: 1, limit: 10 };
//     const searchFilterDTO: SearchFilterDTO = {
//       columnName: 'name',
//       query: 'John',
//     };

// const applySearchFiltersServiceSpy = jest
//   .spyOn(applySearchFilterUtils, 'applySearchFilterUtils')
//   .mockImplementation(
//     async (queryBuilder: any, searchFilterDTO: SearchFilterDTO) => {
//       if (searchFilterDTO.columnName === 'name') {
//         queryBuilder.andWhere('user.name LIKE :query', {
//           query: `%${searchFilterDTO.query}%`,
//         });
//       }
//       return queryBuilder;
//     },
//   );

//     const queryBuilderMock = {
//       withDeleted: jest.fn().mockReturnThis(),
//       leftJoinAndSelect: jest.fn().mockReturnThis(),
//       orderBy: jest.fn().mockReturnThis(),
//       andWhere: jest.fn().mockReturnThis(),
//     };
//     jest
//       .spyOn(usersRepository, 'createQueryBuilder')
//       .mockReturnValue(queryBuilderMock as any);
//     await usersService.findAll(paginationOptions, searchFilterDTO);

//     expect(usersRepository.createQueryBuilder).toHaveBeenCalled();
//     expect(applySearchFiltersServiceSpy).toHaveBeenCalledWith(
//       queryBuilderMock,
//       searchFilterDTO,
//       usersRepository,
//     );
//     expect(paginationService.paginate).toHaveBeenCalledWith(
//       expect.objectContaining({
//         leftJoinAndSelect: expect.any(Function),
//       }),
//       {
//         page: paginationOptions.page,
//         limit: paginationOptions.limit,
//       },
//     );
//   });
// });

// describe('update', () => {
//   describe('when updateUser is called', () => {
//     let user: User;
//     beforeEach(async () => {
//       usersRepository.findOneOrFail.mockResolvedValue(userDataSave() as any);
//       usersRepository.update.mockResolvedValue(updateUserData());
//       user = await usersService.update(userData().id, userDataSave());
//     });
//     it('should call usersRepository.update', async () => {
//       expect(usersRepository.update).toHaveBeenCalledWith(
//         { id: userDataSave().id },
//         userDataSave(),
//       );
//     });

//     it('should return the updated user', () => {
//       expect(user).toEqual(userDataSave());
//     });
//   });
// });

//   describe('remove', () => {
//     describe('when remove users is called', () => {
//       beforeEach(async () => {
//         usersRepository.findOneOrFail.mockResolvedValue(userDataSave() as any);
//         usersRepository.softDelete.mockResolvedValue(deleteUserData());
//       });

//       it('should call userRepository.findOne', async () => {
//         await usersService.remove(userDataSave().id);
//         expect(usersRepository.findOneOrFail).toHaveBeenCalledWith({
//           where: { id: userDataSave().id },
//         });
//       });

//       it('should call userRepository.softdelete', async () => {
//         await usersService.remove(userDataSave().id);
//         expect(usersRepository.softDelete).toHaveBeenCalledWith({
//           id: userDataSave().id,
//         });
//       });

//       it('should return void when the users is removed', async () => {
//         const result = await usersService.remove(userDataSave().id);
//         expect(result).toEqual(deleteUserData());
//       });
//     });
//   });
// });
