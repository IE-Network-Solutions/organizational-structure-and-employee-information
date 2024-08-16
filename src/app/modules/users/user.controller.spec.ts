import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
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
import { employeeJobInformationData } from '../employee-job-information/tests/employee-job-information.data';
import { employeeDocumentData } from '../employee-documents/tests/employee-documents.data';
import { parseNestedJson } from '@root/src/core/utils/parseNestedJson.utils';
import { FilterDto } from './dto/filter-status-user.dto';

jest.mock('./user.service');

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;
    let request: Partial<Request>;

    const tenantId = 'some-tenant-id';

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService],
        }).compile();

        userController = moduleRef.get<UserController>(UserController);
        userService = moduleRef.get<UserService>(UserService);
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a user and call userService.create with correct arguments', async () => {
            const files: Express.Multer.File[] = [
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

            const body = {
                createUserDto: JSON.stringify(userData()),
                createRolePermissionDto: JSON.stringify(rolePermissionData()),
                createUserPermissionDto: JSON.stringify(userPermissionData()),
                createEmployeeInformationDto: JSON.stringify(employeeInformationData()),
                createEmployeeJobInformationDto: JSON.stringify(employeeJobInformationData()),
                createEmployeeDocumentDto: JSON.stringify(employeeDocumentData()),
            };

            (userService.create as jest.Mock).mockResolvedValue(userDataSave());
            let request: Request;
            const result = await userController.create(files, body, request["tenantId"]);

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
            expect(result).toEqual(userDataSave());
        });
    });

    describe('findAll', () => {
        it('should call userService.findAll with correct parameters and return paginated data', async () => {
            (userService.findAll as jest.Mock).mockResolvedValue(paginationResultUserData());
            let request: Request;
            let filterDto: FilterDto;
            const result = await userController.findAll(request['tenantId'], filterDto, paginationOptions());

            expect(userService.findAll).toHaveBeenCalledWith(
                { ...paginationOptions() },
                tenantId
            );
            expect(result).toEqual(paginationResultUserData());
        });
    });

    describe('findOne', () => {
        it('should call userService.findOne with correct id and return user data', async () => {
            (userService.findOne as jest.Mock).mockResolvedValue(userDataOnFindOne());

            const result = await userController.findOne(userDataOnFindOne().id);

            expect(userService.findOne).toHaveBeenCalledWith(userDataOnFindOne().id);
            expect(result).toEqual(userDataOnFindOne());
        });
    });

    describe('update', () => {
        it('should call userService.update with correct id and data and return updated user data', async () => {
            (userService.update as jest.Mock).mockResolvedValue(updateUserData());

            const result = await userController.update(
                userData().id,
                userData() as UpdateUserDto
            );

            expect(userService.update).toHaveBeenCalledWith(
                userData().id,
                userData() as UpdateUserDto
            );
            expect(result).toEqual(updateUserData());
        });
    });

    describe('remove', () => {
        it('should call userService.remove with correct id and return delete result', async () => {
            (userService.remove as jest.Mock).mockResolvedValue(deleteUserData());

            const result = await userController.remove(userData().id);

            expect(userService.remove).toHaveBeenCalledWith(userData().id);
            expect(result).toEqual(deleteUserData());
        });
    });
});
