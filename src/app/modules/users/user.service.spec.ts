// import { Test } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';
// import { UserService } from './user.service';
// import * as applySearchFilterUtils from '@root/src/core/utils/search-filter.utils';
// import { MockProxy, mock } from 'jest-mock-extended';
// import { DataSource, Repository } from 'typeorm';
// import { PaginationService } from '@root/src/core/pagination/pagination.service';
// import { ConflictException, NotFoundException } from '@nestjs/common';
// import { CreateBulkRequestDto } from '@root/src/app/modules/users/createBulkRequest.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
// import { createUserData, deleteUserData, paginationResultUserData, updateUserData, userDataSave } from './tests/user.data';
// import { EmployeeInformationService } from '../employee-information/employee-information.service';
// import { EmployeeJobInformationService } from '../employee-job-information/employee-job-information.service';
// import { EmployeeDocumentService } from '../employee-documents/employee-document.service';
// import { RolePermissionService } from '../role-permission/role-permission.service';
// import { FileUploadService } from '@root/src/core/commonServices/upload.service';
// import { UserPermissionService } from '../user-permission/__mocks__/user-permission.service';

// describe('UserService', () => {
//     let userService: UserService;
//     let usersRepository: MockProxy<Repository<User>>;
//     let paginationService: MockProxy<PaginationService>;

//     const userToken = getRepositoryToken(User);

//     beforeEach(async () => {
//         const moduleRef = await Test.createTestingModule({
//             providers: [
//                 UserService,
//                 {
//                     provide: PaginationService,
//                     useValue: mock<PaginationService>(), // Mock for PaginationService
//                 },
//                 {
//                     provide: getRepositoryToken(User),
//                     useValue: mock<Repository<User>>(),
//                 },
//                 {
//                     provide: DataSource,
//                     useValue: DataSource, // Mock for DataSource
//                 },
//                 {
//                     provide: EmployeeInformationService,
//                     useValue: EmployeeInformationService, // Mock for EmployeeInformationService
//                 },
//                 {
//                     provide: EmployeeJobInformationService,
//                     useValue: EmployeeJobInformationService, // Mock for EmployeeInformationService
//                 },
//                 {
//                     provide: EmployeeDocumentService,
//                     useValue: EmployeeDocumentService, // Mock for EmployeeInformationService
//                 },
//                 {
//                     provide: RolePermissionService,
//                     useValue: RolePermissionService, // Mock for EmployeeInformationService
//                 },
//                 {
//                     provide: FileUploadService,
//                     useValue: FileUploadService, // Mock for EmployeeInformationService
//                 },
//                 // {
//                 //     provide: UserPermissionService,
//                 //     useValue: UserPermissionService, // Mock for EmployeeInformationService
//                 // },


//             ],
//         }).compile();

//         userService = moduleRef.get<UserService>(UserService);
//         usersRepository = moduleRef.get(getRepositoryToken(User));
//         paginationService = moduleRef.get(PaginationService);
//     });


//     describe('create', () => {
//         describe('when createUser is called', () => {
//             let user: User;

//             beforeEach(() => {
//                 usersRepository.create.mockReturnValue(createUserData() as any);
//                 usersRepository.save.mockResolvedValue(userDataSave() as any);
//             });

//             it('should call usersRepository.create with correct arguments', async () => {
//                 await userService.create(
//                     'tenantId',
//                     createUserData() as unknown as CreateBulkRequestDto,
//                     {} as Express.Multer.File,
//                     {} as Express.Multer.File,
//                 );
//                 expect(usersRepository.create).toHaveBeenCalledWith(createUserData());
//             });

//             it('should call usersRepository.save with correct arguments', async () => {
//                 await userService.create(
//                     'tenantId',
//                     createUserData() as unknown as CreateBulkRequestDto,
//                     {} as Express.Multer.File,
//                     {} as Express.Multer.File,
//                 );
//                 expect(usersRepository.save).toHaveBeenCalledWith(createUserData());
//             });

//             it('should return the created user', async () => {
//                 user = await userService.create(
//                     'tenantId',
//                     createUserData() as unknown as CreateBulkRequestDto,
//                     {} as Express.Multer.File,
//                     {} as Express.Multer.File,
//                 );
//                 expect(user).toEqual(userDataSave());
//             });

//             it('should throw ConflictException if an error occurs', async () => {
//                 usersRepository.save.mockRejectedValue(new Error('Conflict'));
//                 await expect(
//                     userService.create(
//                         'tenantId',
//                         createUserData() as unknown as CreateBulkRequestDto,
//                         {} as Express.Multer.File,
//                         {} as Express.Multer.File,
//                     )
//                 ).rejects.toThrow(ConflictException);
//             });
//         });
//     });

//     describe('findOne', () => {
//         describe('when findOne is called', () => {
//             let user: User;

//             beforeEach(async () => {
//                 usersRepository.findOneOrFail.mockResolvedValue(userDataSave() as any);
//                 usersRepository.createQueryBuilder.mockReturnValue({
//                     leftJoinAndSelect: jest.fn().mockReturnThis(),
//                     where: jest.fn().mockReturnThis(),
//                     getOne: jest.fn().mockResolvedValue(userDataSave()),
//                 } as any);
//                 user = await userService.findOne(userDataSave().id);
//             });

//             it('should call usersRepository.createQueryBuilder with correct arguments', () => {
//                 expect(usersRepository.createQueryBuilder).toHaveBeenCalledWith('user');
//                 expect(usersRepository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('user.employeeInformation', 'employeeInformation');
//                 expect(usersRepository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('user.employeeJobInformation', 'employeeJobInformation');
//                 expect(usersRepository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('user.employeeDocument', 'employeeDocument');
//                 expect(usersRepository.createQueryBuilder().where).toHaveBeenCalledWith('user.id = :id', { id: userDataSave().id });
//             });

//             it('should return the user data', () => {
//                 expect(user).toEqual(userDataSave());
//             });

//             it('should throw NotFoundException if user not found', async () => {
//                 usersRepository.findOneOrFail.mockRejectedValue(new Error('EntityNotFoundError'));
//                 await expect(userService.findOne(userDataSave().id)).rejects.toThrow(NotFoundException);
//             });
//         });
//     });

//     describe('findAll', () => {
//         it('should apply search filters and paginate results correctly', async () => {
//             const paginationOptions = { page: 1, limit: 10 };
//             const searchFilterDTO: SearchFilterDTO = {
//                 columnName: 'name',
//                 query: 'John',
//             };

//             const queryBuilderMock = {
//                 withDeleted: jest.fn().mockReturnThis(),
//                 leftJoinAndSelect: jest.fn().mockReturnThis(),
//                 orderBy: jest.fn().mockReturnThis(),
//                 andWhere: jest.fn().mockReturnThis(),
//             };
//             jest.spyOn(usersRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);
//             const paginatedData = { items: [userDataSave()], meta: {} };
//             paginationService.paginate.mockResolvedValue(paginationResultUserData());

//             const applySearchFiltersServiceSpy = jest.spyOn(applySearchFilterUtils, 'applySearchFilterUtils')
//                 .mockImplementation(async (queryBuilder: any, searchFilterDTO: SearchFilterDTO) => {
//                     if (searchFilterDTO.columnName === 'name') {
//                         queryBuilder.andWhere('user.name LIKE :query', { query: `%${searchFilterDTO.query}%` });
//                     }
//                     return queryBuilder;
//                 });

//             const result = await userService.findAll(paginationOptions, searchFilterDTO, 'tenantId');

//             expect(usersRepository.createQueryBuilder).toHaveBeenCalled();
//             expect(applySearchFiltersServiceSpy).toHaveBeenCalledWith(queryBuilderMock, searchFilterDTO, usersRepository);
//             expect(paginationService.paginate).toHaveBeenCalledWith(queryBuilderMock, {
//                 page: paginationOptions.page,
//                 limit: paginationOptions.limit,
//             });
//             expect(result).toEqual(paginatedData);
//         });
//     });

//     describe('update', () => {
//         describe('when update is called', () => {
//             let user: User;

//             beforeEach(async () => {
//                 usersRepository.findOneOrFail.mockResolvedValue(userDataSave() as any);
//                 usersRepository.update.mockResolvedValue(updateUserData());
//                 user = await userService.update(userDataSave().id, userDataSave() as UpdateUserDto);
//             });

//             it('should call usersRepository.update with correct arguments', async () => {
//                 expect(usersRepository.update).toHaveBeenCalledWith({ id: userDataSave().id }, userDataSave());
//             });

//             it('should return the updated user', () => {
//                 expect(user).toEqual(userDataSave());
//             });

//             it('should throw NotFoundException if user not found', async () => {
//                 usersRepository.findOneOrFail.mockRejectedValue(new Error('EntityNotFoundError'));
//                 await expect(userService.update(userDataSave().id, userDataSave() as UpdateUserDto)).rejects.toThrow(NotFoundException);
//             });
//         });
//     });

//     describe('remove', () => {
//         describe('when remove is called', () => {
//             beforeEach(async () => {
//                 usersRepository.findOneOrFail.mockResolvedValue(userDataSave() as any);
//                 usersRepository.softDelete.mockResolvedValue(deleteUserData());
//             });

//             it('should call usersRepository.findOneOrFail with correct arguments', async () => {
//                 await userService.remove(userDataSave().id);
//                 expect(usersRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: userDataSave().id } });
//             });

//             it('should call usersRepository.softDelete with correct arguments', async () => {
//                 await userService.remove(userDataSave().id);
//                 expect(usersRepository.softDelete).toHaveBeenCalledWith({ id: userDataSave().id });
//             });

//             it('should return void when user is removed', async () => {
//                 const result = await userService.remove(userDataSave().id);
//                 expect(result).toEqual(deleteUserData());
//             });

//             it('should throw NotFoundException if user not found', async () => {
//                 usersRepository.findOneOrFail.mockRejectedValue(new Error('EntityNotFoundError'));
//                 await expect(userService.remove(userDataSave().id)).rejects.toThrow(NotFoundException);
//             });
//         });
//     });
// });
