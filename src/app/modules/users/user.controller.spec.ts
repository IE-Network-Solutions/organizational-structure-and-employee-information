// import { Test } from '@nestjs/testing';
// import { UserService } from './user.service';
// import { UserController } from './user.controller';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { User } from './entities/user.entity';
// import { Pagination } from 'nestjs-typeorm-paginate';
// import { parseNestedJson } from '@root/src/core/utils/parseNestedJson.utils';
// import {
//     userData,
//     userDataSave,
//     userDataOnFindOne,
//     createUserData,
//     paginationResultUserData,
//     updateUserData,
//     deleteUserData
// } from './tests/user.data';
// import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
// import { searchFilter } from '@root/src/core/commonTestData/search-filter.data';

// // Mock the UserService
// jest.mock('./user.service');

// describe('UserController', () => {
//     let userController: UserController;
//     let userService: UserService;

//     beforeEach(async () => {
//         const moduleRef = await Test.createTestingModule({
//             imports: [],
//             controllers: [UserController],
//             providers: [UserService],
//         }).compile();

//         userController = moduleRef.get<UserController>(UserController);
//         userService = moduleRef.get<UserService>(UserService);
//         jest.clearAllMocks();
//     });

//     describe('create', () => {
//         describe('when create is called', () => {
//             let user: User;
//             let request: Partial<Request>;
//             let files: Express.Multer.File[];
//             let body: any;

//             beforeEach(async () => {
//                 files = [
//                     { fieldname: 'profileImage', originalname: 'profile.png', buffer: Buffer.from('profile image') } as Express.Multer.File,
//                     { fieldname: 'documentName', originalname: 'document.pdf', buffer: Buffer.from('document') } as Express.Multer.File,
//                 ];

//                 body = {
//                     createUserDto: JSON.stringify(createUserData()),
//                     createRolePermissionDto: JSON.stringify({}),
//                     createUserPermissionDto: JSON.stringify({}),
//                     createEmployeeInformationDto: JSON.stringify({}),
//                     createEmployeeJobInformationDto: JSON.stringify({}),
//                     createEmployeeDocumentDto: JSON.stringify({}),
//                 };

//                 (userService.create as jest.Mock).mockResolvedValue(userDataSave());

//                 user = await userController.create(files, body, request as Request);
//             });

//             it('should call userService.create with correct arguments', () => {
//                 const expectedBulkRequestDto = {
//                     createUserDto: parseNestedJson(body.createUserDto),
//                     createRolePermissionDto: parseNestedJson(body.createRolePermissionDto),
//                     createUserPermissionDto: parseNestedJson(body.createUserPermissionDto),
//                     createEmployeeInformationDto: parseNestedJson(body.createEmployeeInformationDto),
//                     createEmployeeJobInformationDto: parseNestedJson(body.createEmployeeJobInformationDto),
//                     createEmployeeDocumentDto: parseNestedJson(body.createEmployeeDocumentDto),
//                 };

//                 expect(userService.create).toHaveBeenCalledWith(
//                     request['tenantId'],
//                     expectedBulkRequestDto,
//                     files.find(file => file.fieldname === 'profileImage'),
//                     files.find(file => file.fieldname === 'documentName')
//                 );
//             });

//             it('should return the created user', () => {
//                 expect(user).toEqual(userDataSave());
//             });
//         });
//     });

//     describe('findAll', () => {
//         describe('when findAll is called', () => {
//             let request: Partial<Request>;
//             let result: Pagination<User>;

//             beforeEach(async () => {

//                 // Mock the findAll method
//                 (userService.findAll as jest.Mock).mockResolvedValue(paginationResultUserData());

//                 result = await userController.findAll(
//                     request as Request,
//                     paginationOptions(),
//                     searchFilter(),
//                 );
//             });

//             it('should call userService.findAll with correct parameters', () => {
//                 expect(userService.findAll).toHaveBeenCalledWith(
//                     paginationOptions(),
//                     searchFilter(),
//                     request['tenantId'],
//                 );
//             });

//             it('should return a list of users', () => {
//                 expect(result).toEqual(paginationResultUserData());
//             });
//         });
//     });

//     describe('findOne', () => {
//         describe('when findOne is called', () => {
//             let user: User;

//             beforeEach(async () => {
//                 // Mock the findOne method
//                 (userService.findOne as jest.Mock).mockResolvedValue(userDataOnFindOne());

//                 user = await userController.findOne(userDataOnFindOne().id);
//             });

//             it('should call userService.findOne with the correct id', () => {
//                 expect(userService.findOne).toHaveBeenCalledWith(userDataOnFindOne().id);
//             });

//             it('should return the user data', () => {
//                 expect(user).toEqual(userDataOnFindOne());
//             });
//         });
//     });

//     describe('update', () => {
//         describe('when update is called', () => {
//             let user: User;

//             beforeEach(async () => {
//                 // Mock the update method
//                 (userService.update as jest.Mock).mockResolvedValue(updateUserData());

//                 user = await userController.update(userData().id, userData() as UpdateUserDto);
//             });

//             it('should call userService.update with the correct id and data', () => {
//                 expect(userService.update).toHaveBeenCalledWith(userData().id, userData() as UpdateUserDto);
//             });

//             it('should return the updated user data', () => {
//                 expect(user).toEqual(updateUserData());
//             });
//         });
//     });

//     describe('remove', () => {
//         describe('when remove is called', () => {
//             beforeEach(async () => {
//                 // Mock the remove method
//                 (userService.remove as jest.Mock).mockResolvedValue(deleteUserData());

//                 await userController.remove(userData().id);
//             });

//             it('should call userService.remove with the correct id', () => {
//                 expect(userService.remove).toHaveBeenCalledWith(userData().id);
//             });

//             it('should return void', async () => {
//                 await expect(userController.remove(userData().id)).resolves.toBeUndefined();
//             });
//         });
//     });
// });
