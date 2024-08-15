import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { parseNestedJson } from '@root/src/core/utils/parseNestedJson.utils';
import {
    userData,
    userDataSave,
    userDataOnFindOne,
    paginationResultUserData,
    updateUserData,
    deleteUserData,
} from './tests/user.data';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { rolePermissionData } from '../role-permission/tests/role-permission.data';
import { userPermissionData } from '../user-permission/tests/user-permission.data';
import { employeeInformationData } from '../employee-information/tests/employee-information.data';
import { employeeJobInformationData, employeeJobInformationDataSave } from '../employee-job-information/tests/employee-job-information.data';
import { employeeDocumentData } from '../employee-documents/tests/employee-documents.data';

// Mock the UserService
jest.mock('./user.service');

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;
    let request: Partial<Request>;

    const tenantId = 'some-tenant-id'; // Replace with the actual tenantId value or mock as needed.

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService],
        }).compile();

        userController = moduleRef.get<UserController>(UserController);
        userService = moduleRef.get<UserService>(UserService);
        jest.clearAllMocks();
    });

    describe('create', () => {
        describe('when create is called', () => {
            let user: User;
            let files: Express.Multer.File[];
            let body: any;

            beforeEach(async () => {
                files = [
                    {
                        fieldname: 'profileImage',
                        originalname: 'profile.png',
                        buffer: Buffer.from('profile image'),
                    } as Express.Multer.File,
                    {
                        fieldname: 'documentName',
                        originalname: 'document.pdf',
                        buffer: Buffer.from('document'),
                    } as Express.Multer.File,
                ];

                body = {
                    createUserDto: JSON.stringify(userData()),
                    createRolePermissionDto: JSON.stringify(rolePermissionData()),
                    createUserPermissionDto: JSON.stringify(userPermissionData()),
                    createEmployeeInformationDto: JSON.stringify(employeeInformationData()),
                    createEmployeeJobInformationDto: JSON.stringify(employeeJobInformationData()),
                    createEmployeeDocumentDto: JSON.stringify(employeeDocumentData()),
                };

                (userService.create as jest.Mock).mockResolvedValue(userDataSave());

                user = await userController.create(files, body, {
                    tenantId,
                } as unknown as Request);
            });

            it('should call userService.create with correct arguments', () => {
                const expectedBulkRequestDto = {
                    createUserDto: parseNestedJson(body.createUserDto),
                    createRolePermissionDto: parseNestedJson(body.createRolePermissionDto),
                    createUserPermissionDto: parseNestedJson(body.createUserPermissionDto),
                    createEmployeeInformationDto: parseNestedJson(body.createEmployeeInformationDto),
                    createEmployeeJobInformationDto: parseNestedJson(body.createEmployeeJobInformationDto),
                    createEmployeeDocumentDto: parseNestedJson(body.createEmployeeDocumentDto),
                };

                expect(userService.create).toHaveBeenCalledWith(
                    tenantId,
                    expectedBulkRequestDto,
                    files.find(file => file.fieldname === 'profileImage'),
                    files.find(file => file.fieldname === 'documentName')
                );
            });

            it('should return the created user', () => {
                expect(user).toEqual(userDataSave());
            });
        });
    });

    describe('findAll', () => {
        describe('when findAll is called', () => {
            let result: Pagination<User>;

            beforeEach(async () => {
                (userService.findAll as jest.Mock).mockResolvedValue(
                    paginationResultUserData()
                );

                result = await userController.findAll(
                    { tenantId } as unknown as Request,
                    paginationOptions()
                );
            });

            it('should call userService.findAll with correct parameters', () => {
                expect(userService.findAll).toHaveBeenCalledWith(
                    paginationOptions(),
                    tenantId
                );
            });

            it('should return a list of users', () => {
                expect(result).toEqual(paginationResultUserData());
            });
        });
    });

    describe('findOne', () => {
        describe('when findOne is called', () => {
            let user: User;

            beforeEach(async () => {
                (userService.findOne as jest.Mock).mockResolvedValue(userDataOnFindOne());

                user = await userController.findOne(userDataOnFindOne().id);
            });

            it('should call userService.findOne with the correct id', () => {
                expect(userService.findOne).toHaveBeenCalledWith(
                    userDataOnFindOne().id
                );
            });

            it('should return the user data', () => {
                expect(user).toEqual(userDataOnFindOne());
            });
        });
    });

    describe('update', () => {
        describe('when update is called', () => {
            let user: User;

            beforeEach(async () => {
                (userService.update as jest.Mock).mockResolvedValue(updateUserData());

                user = await userController.update(
                    userData().id,
                    userData() as UpdateUserDto
                );
            });

            it('should call userService.update with the correct id and data', () => {
                expect(userService.update).toHaveBeenCalledWith(
                    userData().id,
                    userData() as UpdateUserDto
                );
            });

            it('should return the updated user data', () => {
                expect(user).toEqual(updateUserData());
            });
        });
    });

    describe('remove', () => {
        describe('when remove is called', () => {
            beforeEach(async () => {
                (userService.remove as jest.Mock).mockResolvedValue(deleteUserData());

                await userController.remove(userData().id);
            });

            it('should call userService.remove with the correct id', () => {
                expect(userService.remove).toHaveBeenCalledWith(userData().id);
            });

            test('then it should remove a user', async () => {
                expect(await userController.remove(userData().id)).toEqual(
                    deleteUserData(),
                );
            });
        });
    });
});
