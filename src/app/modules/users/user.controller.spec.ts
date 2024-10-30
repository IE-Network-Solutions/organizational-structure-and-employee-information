import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { Request } from 'express';
import {
  userData,
  userDataSave,
  userDataOnFindOne,
  paginationResultUserData,
  deleteUserData,
  mockUsers,
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

    userService.findUserInfoByArrayOfUserIds = jest.fn();
  });

  describe('create', () => {
    let request: Request;

    beforeEach(async () => {
      request = {
        tenantId: 'tenantId', // Mock tenantId
      } as any;
    });

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
        createEmployeeJobInformationDto: JSON.stringify(
          employeeJobInformationData(),
        ),
        createEmployeeDocumentDto: JSON.stringify(employeeDocumentData()),
      };

      (userService.create as jest.Mock).mockResolvedValue(userDataSave());

      // Pass the request object directly to the method
      const result = await userController.create(
        files,
        body,
        request['tenantId'],
      );

      const expectedBulkRequestDto = {
        createUserDto: parseNestedJson(body.createUserDto),
        createRolePermissionDto: parseNestedJson(body.createRolePermissionDto),
        createUserPermissionDto: parseNestedJson(body.createUserPermissionDto),
        createEmployeeInformationDto: parseNestedJson(
          body.createEmployeeInformationDto,
        ),
        createEmployeeJobInformationDto: parseNestedJson(
          body.createEmployeeJobInformationDto,
        ),
        createEmployeeDocumentDto: parseNestedJson(
          body.createEmployeeDocumentDto,
        ),
      };
      expect(result).toEqual(userDataSave());
    });
  });

  describe('findAll', () => {
    it('should call userService.findAll with correct parameters and return paginated data', async () => {
      // Mock the request object with a tenantId using type assertion
      const request = {
        tenantId: 'some-tenant-id', // Mock tenantId
      } as unknown as Request;

      // Mock filterDto and paginationOptions if necessary
      const filterDto: FilterDto = {}; // Replace with appropriate mock data if needed
      const paginationDto = paginationOptions(); // Replace with appropriate mock data if needed

      // Mock the userService.findAll method
      (userService.findAll as jest.Mock).mockResolvedValue(
        paginationResultUserData(),
      );

      // Call the findAll method on the controller
      const result = await userController.findAll(
        request['tenantId'],
        filterDto,
        paginationDto,
      );

      // Expect the result to be as mocked
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
    it('should call userService.update with the correct id, tenantId, and data, and return updated user data', async () => {
      // Mock the request object to include the tenantId
      const request = {
        tenantId: 'tenant-id-123', // Mock tenantId
      } as unknown as Request;

      // Mock the user data
      const mockUpdatedUser = userData() as any;
      jest.spyOn(userService, 'update').mockResolvedValue(mockUpdatedUser);

      // Call the controller method
      const result = await userController.update(
        request['tenantId'], // Pass the tenant ID second
        userData().id, // Pass the user ID first
        mockUpdatedUser, // Pass the user data third
      );

      expect(result).toEqual(mockUpdatedUser);
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

  describe('findUserInfoByArrayOfUserIds', () => {
    it('should call userService.findUserInfoByArrayOfUserIds with the correct array of IDs and return the expected user data', async () => {
      const arrayOfIds = ['1', '2'];
      // jest.spyOn(userService, 'findUserInfoByArrayOfUserIds').mockImplementation(jest.fn());

      // Mock the service method to return formatted mockUsers
      (userService.findUserInfoByArrayOfUserIds as jest.Mock).mockResolvedValue(
        mockUsers.map((user) => ({
          lastName: user.lastName,
          firstName: user.firstName,
          middleName: user.middleName,
          Avatar: user.Avatar,
          Email: user.email,
          DepartmentName:
            user.employeeJobInformation[0]?.department?.name || null,
        })),
      );

      const result = await userController.findUserInfoByArrayOfUserIds(
        arrayOfIds,
      );

      // Assert the service method is called with the correct arguments
      expect(userService.findUserInfoByArrayOfUserIds).toHaveBeenCalledWith(
        arrayOfIds,
      );

      // Assert the result is the expected user data
      expect(result).toEqual(
        mockUsers.map((user) => ({
          lastName: user.lastName,
          firstName: user.firstName,
          middleName: user.middleName,
          Avatar: user.Avatar,
          Email: user.email,
          DepartmentName:
            user.employeeJobInformation[0]?.department?.name || null,
        })),
      );
    });
  });
});
