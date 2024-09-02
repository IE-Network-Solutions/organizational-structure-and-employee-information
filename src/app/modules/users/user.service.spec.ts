import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { MockProxy, mock } from 'jest-mock-extended';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  createUserData,
  deleteUserData,
  paginationResultUserData,
  updateUserData,
  userData,
  userDataSave,
} from './tests/user.data';
import { EmployeeInformationService } from '../employee-information/employee-information.service';
import { EmployeeJobInformationService } from '../employee-job-information/employee-job-information.service';
import { EmployeeDocumentService } from '../employee-documents/employee-document.service';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { UserPermissionService } from '../user-permission/user-permission.service';
import { DepartmentsService } from '../departments/departments.service';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';
import { FileUploadService } from '@root/src/core/upload/upload.service';
import { FilterDto } from './dto/filter-status-user.dto';
import * as admin from 'firebase-admin';
import { RoleService } from '../role/role.service';

jest.mock('firebase-admin', () => {
  return {
    auth: jest.fn().mockReturnValue({
      createUser: jest.fn().mockResolvedValue({ uid: 'firebase-uid-123' }),
      updateUser: jest.fn().mockResolvedValue({ uid: 'firebase-uid-123' }),
    }),
    initializeApp: jest.fn(),
  };
});

describe('UserService', () => {
  let userService: UserService;
  let usersRepository: MockProxy<Repository<User>>;
  let paginationService: MockProxy<PaginationService>;
  let employeeInformationService: EmployeeInformationService;
  let employeeJobInformationService: EmployeeJobInformationService;
  let employeeDocumentService: EmployeeDocumentService;
  let rolePermissionService: RolePermissionService;
  let fileUploadService: FileUploadService;
  let rolesService: RoleService;
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
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
          provide: RoleService,
          useValue: mock<RoleService>(),
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    usersRepository = moduleRef.get(getRepositoryToken(User));
    paginationService = moduleRef.get(PaginationService);
    employeeInformationService = moduleRef.get<EmployeeInformationService>(
      EmployeeInformationService,
    );
    employeeJobInformationService =
      moduleRef.get<EmployeeJobInformationService>(
        EmployeeJobInformationService,
      );
    employeeDocumentService = moduleRef.get<EmployeeDocumentService>(
      EmployeeDocumentService,
    );
    rolePermissionService = moduleRef.get<RolePermissionService>(
      RolePermissionService,
    );
    rolesService = moduleRef.get<RoleService>(RoleService);
    fileUploadService = moduleRef.get<FileUploadService>(FileUploadService);
    queryRunner = moduleRef.get<DataSource>(DataSource).createQueryRunner();
  });
  beforeAll(() => {
    admin.initializeApp(); // Initialize Firebase in the test setup
  });

  describe('create', () => {
    it('should create user, role permissions, user permissions, employee information, job information, and document', async () => {
      const tenantId = 'tenant-123';
      const createBulkRequestDto: any = {
        createUserDto: createUserData(),
        createRolePermissionDto: {
          roleId: 'role-123',
          permissionId: ['perm-1', 'perm-2'],
        },
        createUserPermissionDto: {
          permissionId: ['perm-1', 'perm-2'],
        },
        createEmployeeInformationDto: {},
        createEmployeeJobInformationDto: {},
        createEmployeeDocumentDto: {},
      };
      const profileImage: Express.Multer.File = {} as any;
      const documentName: Express.Multer.File = {} as any;

      const user = createUserData() as any;
      const savedUser = userDataSave() as any;

      // Mock the uploadFileToServer method to return the expected structure
      jest.spyOn(fileUploadService, 'uploadFileToServer').mockResolvedValue({
        viewImage:
          'https://files.ienetworks.co/view/test/9fdb9540-607e-4cc5-aebf-0879400d1f69/photo_5987918588494857122_x.jpg',
        image:
          'https://files.ienetworks.co/download/test/9fdb9540-607e-4cc5-aebf-0879400d1f69/photo_5987918588494857122_x.jpg',
      });

      usersRepository.create.mockReturnValue(user);
      usersRepository.save.mockResolvedValue(savedUser);
      jest
        .spyOn(employeeInformationService, 'create')
        .mockResolvedValue({ id: 'emp-info-123' } as any);
      jest
        .spyOn(employeeJobInformationService, 'create')
        .mockResolvedValue({} as any);
      jest
        .spyOn(employeeDocumentService, 'create')
        .mockResolvedValue({} as any);
      jest
        .spyOn(rolePermissionService, 'updateRolePermissions')
        .mockResolvedValue({} as any);
      jest.spyOn(userService, 'findOne').mockResolvedValue(savedUser);

      const result = await userService.create(
        tenantId,
        createBulkRequestDto,
        profileImage,
        documentName,
      );

      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalledWith(user);
      expect(rolePermissionService.updateRolePermissions).toHaveBeenCalledWith(
        createBulkRequestDto.createRolePermissionDto.roleId,
        createBulkRequestDto.createRolePermissionDto.permissionId,
        tenantId,
      );
      expect(employeeInformationService.create).toHaveBeenCalledWith(
        createBulkRequestDto.createEmployeeInformationDto,
        tenantId,
      );
      expect(employeeJobInformationService.create).toHaveBeenCalledWith(
        createBulkRequestDto.createEmployeeJobInformationDto,
        tenantId,
      );
      expect(employeeDocumentService.create).toHaveBeenCalledWith(
        createBulkRequestDto.createEmployeeDocumentDto,
        documentName,
        tenantId,
      );
      expect(userService.findOne).toHaveBeenCalledWith(savedUser.id);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(result).toEqual(savedUser);
    });

    it('should rollback transaction on error', async () => {
      const tenantId = 'tenant-123';
      const createBulkRequestDto: any = {
        createUserDto: createUserData(),
        createRolePermissionDto: {
          roleId: 'role-123',
          permissionId: ['perm-1', 'perm-2'],
        },
        createUserPermissionDto: {
          permissionId: ['perm-1', 'perm-2'],
        },
        createEmployeeInformationDto: {},
        createEmployeeJobInformationDto: {},
        createEmployeeDocumentDto: {},
      };
      const profileImage: Express.Multer.File = {} as any;
      const documentName: Express.Multer.File = {} as any;

      usersRepository.save.mockRejectedValue(new Error('Something went wrong'));

      await expect(
        userService.create(
          tenantId,
          createBulkRequestDto,
          profileImage,
          documentName,
        ),
      ).rejects.toThrow(ConflictException);

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return the user if found', async () => {
      const user = userDataSave() as any;

      // Mock the createQueryBuilder and chain the necessary methods
      usersRepository.createQueryBuilder.mockReturnValue({
        withDeleted: jest.fn().mockReturnThis(), // Mock the withDeleted method
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(user),
      } as any);

      const result = await userService.findOne(userDataSave().id);

      expect(result).toEqual(userDataSave());
    });

    it('should throw NotFoundException if the user is not found', async () => {
      usersRepository.createQueryBuilder.mockReturnValue({
        withDeleted: jest.fn().mockReturnThis(), // Mock the withDeleted method
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(userService.findOne(userDataSave().id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated user data even if employeeJobInformation is empty', async () => {
      const userWithEmptyJobInfo = {
        ...userDataSave(),
        employeeJobInformation: [],
      };

      const queryBuilderMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        withDeleted: jest.fn().mockReturnThis(), // Mock the withDeleted method
        getMany: jest.fn().mockResolvedValue([userWithEmptyJobInfo]),
      };

      jest
        .spyOn(usersRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      paginationService.paginate.mockResolvedValue(paginationResultUserData());

      const filterDto: FilterDto = {};
      const result = await userService.findAll(
        filterDto,
        paginationOptions(),
        '9fdb9540-607e-4cc5-aebf-0879400d1f69',
      );

      expect(paginationService.paginate).toHaveBeenCalledWith(
        queryBuilderMock,
        { page: paginationOptions().page, limit: paginationOptions().limit },
      );
      expect(result).toEqual(paginationResultUserData());
    });
  });

  describe('update', () => {
    it('should update the user and return the updated data', async () => {
      const request = {
        tenantId: 'some-tenant-id', // Mock tenantId
      } as unknown as Request;

      // Mock user data before update
      const user = userDataSave() as any;

      // Mock updated user data
      const updatedUser = updateUserData() as any;

      // Mock the interactions with the repository and service
      usersRepository.findOneOrFail.mockResolvedValueOnce(user);
      usersRepository.update.mockResolvedValueOnce(undefined); // Update returns void/undefined
      usersRepository.findOneOrFail.mockResolvedValueOnce(updatedUser); // After update, return the updated user

      // Call the update method
      const result = await userService.update(
        user.id,
        request['tenantId'],
        userData(),
      );

      // Adjust the expected call to match the structure
      expect(usersRepository.update).toHaveBeenCalledWith(
        { id: user.id }, // Pass the id as an object
        expect.objectContaining({
          firstName: 'John',
          middleName: 'H',
          lastName: 'Doe',
          profileImage: 'profile_image_url',
          profileImageDownload: 'profile_image_download_url',
          email: 'hiluf@gmail.com',
          roleId: 'role-id-123',
          tenantId: 'tenant-id-123',
        }),
      );

      // Assert the final result is the updated user data
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove the user and return void', async () => {
      usersRepository.findOneOrFail.mockResolvedValue(userDataSave() as any);
      usersRepository.softDelete.mockResolvedValue(deleteUserData());

      const result = await userService.remove(userDataSave().id);

      expect(usersRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: userDataSave().id },
      });
      expect(usersRepository.softDelete).toHaveBeenCalledWith({
        id: userDataSave().id,
      });
      expect(result).toEqual(deleteUserData());
    });
  });
});
