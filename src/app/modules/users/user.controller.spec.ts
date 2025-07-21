import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
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
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { EmployeeInformationService } from '../employee-information/employee-information.service';
import { EmployeeJobInformationService } from '../employee-job-information/employee-job-information.service';
import { EmployeeDocumentService } from '../employee-documents/employee-document.service';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { FileUploadService } from '@root/src/core/upload/upload.service';
import { HttpService } from '@nestjs/axios';
import { RoleService } from '../role/role.service';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { DepartmentsService } from '../departments/departments.service';
import { UserPermissionService } from '../user-permission/user-permission.service';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserDepartmentService } from './services/user-relation-with-department.service';
import { DelegationService } from '../delegations/delegations.service';
import { FirebaseAuthService } from '@root/src/core/firebaseAuth/firbase-auth.service';
import { OtherServiceDependenciesService } from '../other-service-dependencies/other-service-dependencies.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let request: Partial<Request>;
  let paginationService: MockProxy<PaginationService>;
  let employeeInformationService: EmployeeInformationService;
  let employeeJobInformationService: EmployeeJobInformationService;
  let employeeDocumentService: EmployeeDocumentService;
  let rolePermissionService: RolePermissionService;
  let fileUploadService: FileUploadService;
  let httpService: HttpService;
  let rolesService: RoleService;
  let queryRunner: QueryRunner;
  let configService: ConfigService;
  let userDepartmentService: UserDepartmentService;
  let usersRepository: MockProxy<Repository<User>>;

  const tenantId = 'some-tenant-id';

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mock<Repository<User>>(),
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
            }),
          },
        },
        {
          provide: PaginationService,
          useValue: mock<PaginationService>(),
        },

        {
          provide: DelegationService,
          useValue: mock<DelegationService>(),
        },

        {
          provide: EmployeeInformationService,
          useValue: mock<EmployeeInformationService>(),
        },
        {
          provide: EmployeeJobInformationService,
          useValue: mock<EmployeeJobInformationService>(),
        },
        {
          provide: EmployeeDocumentService,
          useValue: mock<EmployeeDocumentService>(),
        },
        {
          provide: RolePermissionService,
          useValue: mock<RolePermissionService>(),
        },
        {
          provide: FileUploadService,
          useValue: mock<FileUploadService>(),
        },
        {
          provide: UserPermissionService,
          useValue: mock<UserPermissionService>(),
        },
        {
          provide: DepartmentsService,
          useValue: mock<DepartmentsService>(),
        },
        {
          provide: UserDepartmentService,
          useValue: mock<UserDepartmentService>(),
        },
        {
          provide: RoleService,
          useValue: mock<RoleService>(),
        },
        {
          provide: HttpService,
          useValue: mock<HttpService>(),
        },
        {
          provide: ConfigService,
          useValue: mock<ConfigService>(),
        },
        {
          provide: FirebaseAuthService,
          useValue: mock<FirebaseAuthService>(),
        },
        {
          provide: OtherServiceDependenciesService,
          useValue: mock<OtherServiceDependenciesService>(),
        },
      ],
    }).compile();

    usersRepository = moduleRef.get(getRepositoryToken(User));
    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);

    jest.clearAllMocks();

    jest.spyOn(userService, 'create').mockResolvedValue(userDataSave() as any);
    jest
      .spyOn(userService, 'findAll')
      .mockResolvedValue(paginationResultUserData() as any);
    jest
      .spyOn(userService, 'findOne')
      .mockResolvedValue(userDataOnFindOne() as any);
    jest.spyOn(userService, 'update').mockResolvedValue(userData() as any);
    jest
      .spyOn(userService, 'remove')
      .mockResolvedValue(deleteUserData() as any);
    jest.spyOn(userService, 'findUserInfoByArrayOfUserIds').mockResolvedValue(
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

  describe('create', () => {
    let request: Request;

    beforeEach(() => {
      request = { tenantId: 'tenantId' } as any;
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
      const request = { tenantId: 'some-tenant-id' } as unknown as Request;
      const filterDto: FilterDto = {};
      const paginationDto = paginationOptions();

      const result = await userController.findAll(
        request['tenantId'],
        filterDto,
        paginationDto,
      );
      expect(result).toEqual(paginationResultUserData());
    });
  });

  describe('findOne', () => {
    it('should call userService.findOne with correct id and return user data', async () => {
      const result = await userController.findOne(userDataOnFindOne().id);
      expect(userService.findOne).toHaveBeenCalledWith(userDataOnFindOne().id);
      expect(result).toEqual(userDataOnFindOne());
    });
  });

  describe('update', () => {
    it('should call userService.update with the correct id, tenantId, and data, and return updated user data', async () => {
      const request = { tenantId: 'tenant-id-123' } as unknown as Request;
      const mockUpdatedUser = userData();

      const result = await userController.update(
        request['tenantId'],
        userData().id,
        mockUpdatedUser,
      );
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('remove', () => {
    it('should call userService.remove with correct id and return delete result', async () => {
      const result = await userController.remove(userData().id);
      expect(userService.remove).toHaveBeenCalledWith(userData().id);
      expect(result).toEqual(deleteUserData());
    });
  });

  describe('findUserInfoByArrayOfUserIds', () => {
    it('should call userService.findUserInfoByArrayOfUserIds with the correct array of IDs and return the expected user data', async () => {
      const arrayOfIds = ['1', '2'];
      const result = await userController.findUserInfoByArrayOfUserIds(
        arrayOfIds,
      );
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
