import { DataSource, In } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeDocumentService } from '../../employee-documents/employee-document.service';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { checkIfDataExists } from '@root/src/core/utils/checkIfDataExists.util';
import { EmployeeInformationService } from '../../employee-information/employee-information.service';
import { EmployeeJobInformationService } from '../../employee-job-information/employee-job-information.service';
import { QueryRunner, Repository } from 'typeorm';
import { RolePermissionService } from '../../role-permission/role-permission.service';
import { FileUploadService } from '@root/src/core/upload/upload.service';
import { CreateUserPermissionDto } from '../../user-permission/dto/create-user-permission.dto';
import { UserPermissionService } from '../../user-permission/user-permission.service';
import { DepartmentsService } from '../../departments/departments.service';
import { CreateBulkRequestDto } from '../dto/createBulkRequest.dto';
import {
  generateRandom4DigitNumber,
} from '@root/src/core/utils/generateRandomNumbers';
import filterEntities from '@root/src/core/utils/filters.utils';
import { FilterDto } from '../dto/filter-status-user.dto';
import * as admin from 'firebase-admin';
import { CreateUserDto } from '../dto/create-user.dto';
import { RoleService } from '../../role/role.service';
import { CreateRoleDto } from '../../role/dto/create-role.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ImportEmployeeDto } from '../dto/import-user.dto';
import { EmployeeInformation } from '../../employee-information/entities/employee-information.entity';
import { CreateEmployeeInformationDto } from '../../employee-information/dto/create-employee-information.dto';
import { CreateEmployeeJobInformationDto } from '../../employee-job-information/dto/create-employee-job-information.dto';
import { CreateRolePermissionDto } from '../../role-permission/dto/create-role-permission.dto';

@Injectable()
export class UserService {
  private readonly emailServerUrl: string;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly paginationService: PaginationService,
    private readonly employeeInformationService: EmployeeInformationService,
    private readonly employeeJobInformationService: EmployeeJobInformationService,
    private readonly employeeDocumentService: EmployeeDocumentService,
    private readonly rolePermissionService: RolePermissionService,
    private readonly fileUploadService: FileUploadService,
    private readonly userPermissionService: UserPermissionService,
    @Inject(forwardRef(() => DepartmentsService))
    private readonly departmentService: DepartmentsService,
    private readonly rolesService: RoleService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.emailServerUrl = this.configService.get<string>(
      'servicesUrl.emailUrl',
    );
    // this.tenantUrl = this.configService.get<string>(
    //   'servicesUrl.tenantUrl',
    // );
  }

  async create(
    tenantId: string,
    createBulkRequestDto: CreateBulkRequestDto,
    profileImage?: Express.Multer.File,
    documentName?: Express.Multer.File,
  ) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const {
        createUserDto,
        createRolePermissionDto,
        createUserPermissionDto,
        createEmployeeInformationDto,
        createEmployeeJobInformationDto,
        createEmployeeDocumentDto,
      } = createBulkRequestDto;
      if (profileImage) {
        const uploadedImagePath =
          await this.fileUploadService.uploadFileToServer(
            tenantId,
            profileImage,
          );

        createUserDto['profileImage'] = uploadedImagePath['viewImage'];

        createUserDto['profileImageDownload'] = uploadedImagePath['image'];
      }
      //  const tenant= await this.getTenantDomain(tenantId)

      const user = this.userRepository.create({ ...createUserDto, tenantId });
      const userRecord = await this.createUserToFirebase(
        createUserDto.email,
        createUserDto.firstName,
        tenantId,
        //  tenant.domainUrl
      );
      user.firebaseId = userRecord.uid;

      const valuesToCheck = { email: user.email };
      await checkIfDataExists(valuesToCheck, this.userRepository);
      const result = await this.userRepository.save(user);
      await this.rolePermissionService.updateRolePermissions(
        createRolePermissionDto['roleId'],
        createRolePermissionDto['permissionId'],
        tenantId,
      );

      createUserPermissionDto['userId'] = result.id;

      createUserPermissionDto['permissionId'] =
        createUserPermissionDto.permissionId;

      await this.assignPermissionToUser(createUserPermissionDto, tenantId);

      createEmployeeInformationDto['userId'] = result.id;

      const employeeInformation = await this.employeeInformationService.create(
        createEmployeeInformationDto,
        tenantId,
      );

      createEmployeeJobInformationDto['userId'] = result.id;

      await this.employeeJobInformationService.create(
        createEmployeeJobInformationDto,
        tenantId,
      );
      if (createEmployeeDocumentDto) {
        createEmployeeDocumentDto['userId'] = result.id;

        createEmployeeDocumentDto['employeeInformationId'] =
          employeeInformation.id;

        await this.employeeDocumentService.create(
          createEmployeeDocumentDto,
          documentName,
          tenantId,
        );
      }

      await queryRunner.commitTransaction();

      return await this.findOne(result.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    filterDto: FilterDto,
    paginationOptions: PaginationDto,
    tenantId: string,
  ) {
    try {
      const filterableFields = ['firstName', 'middleName', 'lastName', 'email'];
      const userFilters = {
        'employeeJobInformation.branchId':
          filterDto.branchId === '' ? undefined : filterDto.branchId,
        'employeeJobInformation.departmentId':
          filterDto.departmentId === '' ? undefined : filterDto.departmentId,
        deletedAt:
          filterDto.deletedAt === '' || filterDto.deletedAt === 'null'
            ? null
            : filterDto.deletedAt,
        searchString: filterDto.searchString,
      };

      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      let queryBuilder = await this.userRepository
        .createQueryBuilder('user')

        .withDeleted()
        .leftJoinAndSelect(
          'user.employeeJobInformation',
          'employeeJobInformation',
          'employeeJobInformation.isPositionActive = :isPositionActive',
          { isPositionActive: true },
        )
        .leftJoinAndSelect('user.employeeInformation', 'employeeInformation')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect(
          'employeeJobInformation.employementType',
          'employementType',
        )
        .leftJoinAndSelect('employeeInformation.nationality', 'nationality')
        .leftJoinAndSelect('employeeJobInformation.branch', 'branch')
        .leftJoinAndSelect('employeeJobInformation.position', 'position')
        .leftJoinAndSelect('employeeJobInformation.department', 'department')
        .andWhere('user.tenantId = :tenantId', { tenantId });
      queryBuilder = await filterEntities(
        queryBuilder,
        userFilters,
        this.userRepository,
        filterableFields,
      );

      const paginatedData = await this.paginationService.paginate<User>(
        queryBuilder,
        options,
      );

      for (const user of paginatedData.items) {
        user['reportingTo'] = await this.findReportingToUser(user.id);

        if (
          user.employeeJobInformation &&
          user.employeeJobInformation.length > 0
        ) {
          const data = [];

          user.employeeJobInformation[0] = user.employeeJobInformation[0];
        }
      }
      return paginatedData;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User not found.`);
      }
      throw error;
    }
  }

  async findAllUsersByDepartment(tenantId: string, departmentId: string) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .withDeleted()
      .leftJoinAndSelect(
        'user.employeeJobInformation',
        'employeeJobInformation',
        'employeeJobInformation.isPositionActive = :isPositionActive',
        { isPositionActive: true },
      )
      .where('employeeJobInformation.departmentId = :departmentId', {
        departmentId,
      })
      .andWhere('user.tenantId = :tenantId', { tenantId })
      .getMany();

    return users;
  }
  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.employeeDocument', 'employeeDocument')
        .withDeleted()
        .leftJoinAndSelect(
          'user.employeeJobInformation',
          'employeeJobInformation',
        )
        .leftJoinAndSelect(
          'employeeJobInformation.employementType',
          'employementType',
        )
        .leftJoinAndSelect('user.employeeInformation', 'employeeInformation')
        .leftJoinAndSelect('employeeInformation.nationality', 'nationality')
        .leftJoinAndSelect('employeeJobInformation.branch', 'branch')
        .leftJoinAndSelect('employeeJobInformation.position', 'position')
        .leftJoinAndSelect('employeeJobInformation.department', 'department')

        .leftJoinAndSelect(
          'employeeJobInformation.workSchedule',
          'workSchedule',
        )
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('user.userPermissions', 'userPermissions')
        .where('user.id = :id', { id })
        .getOne();
      user['reportingTo'] = await this.findReportingToUser(id);

      return { ...user };
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }

  async update(id: string, tenantId: string, updateUserDto: UpdateUserDto) {
    try {
      const createPremission = new CreateUserPermissionDto();
      createPremission.permissionId = updateUserDto.permission
        ? updateUserDto.permission
        : [];
      createPremission.userId = id;
      delete updateUserDto.permission;
      await this.userRepository.findOneOrFail({ where: { id: id } });
      await this.userRepository.update({ id }, updateUserDto);
      if (
        createPremission.permissionId.length > 0 &&
        createPremission.permissionId
      ) {
        await this.userPermissionService.update(id, createPremission, tenantId);
      }
      return await this.userRepository.findOneOrFail({ where: { id: id } });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }

  async updateUserDepartment(id: string, newDepartmentId: string): Promise<void> {
    await this.employeeJobInformationService.update(
      id ,
      { departmentId: newDepartmentId }
    );
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id: id },
      });
      await admin.auth().updateUser(user.firebaseId, {
        disabled: true,
      });

      return await this.userRepository.softRemove({ id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error?.message || error;
    }
  }
  
  async findReportingToUser(id: string) {
    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .withDeleted()
        .leftJoinAndSelect(
          'user.employeeJobInformation',
          'employeeJobInformation',
          'employeeJobInformation.isPositionActive = :isPositionActive',
          { isPositionActive: true },
        )
        .leftJoinAndSelect('user.role', 'role')
        .where('user.id = :id', { id });

      const user = await queryBuilder.getOne();

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }

      if (
        user.employeeJobInformation &&
        user.employeeJobInformation.length > 0
      ) {
        const jobInfo = user.employeeJobInformation[0];

        if (jobInfo.departmentLeadOrNot === true) {
          const department = await this.departmentService.findAncestor(
            jobInfo.departmentId,
          );
          if (department) {
            return await this.findTeamLeadOrNot(department.id);
          }
        }
        return await this.findTeamLeadOrNot(jobInfo.departmentId);
      }
    } catch (error) {
      throw error;
    }
  }

  async findTeamLeadOrNot(departmentId: string): Promise<any> {
    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .withDeleted()
        .leftJoinAndSelect(
          'user.employeeJobInformation',
          'employeeJobInformation',
          'employeeJobInformation.isPositionActive = :isPositionActive',
          { isPositionActive: true },
        )
        .leftJoinAndSelect('user.role', 'role')
        .andWhere('employeeJobInformation.departmentId = :departmentId', {
          departmentId,
        })
        .andWhere(
          'employeeJobInformation.departmentLeadOrNot = :departmentLeadOrNot',
          { departmentLeadOrNot: true },
        );
      const users = await queryBuilder.getMany();
      if (users.length > 0) {
        return users[0];
      } else {
        const department = await this.departmentService.findAncestor(
          departmentId,
        );
        if (department && department.id) {
          return this.findTeamLeadOrNot(department.id);
        } else {
          return null;
        }
      }
    } catch (error) {
      return null;
    }
  }

  async assignPermissionToUser(
    createUserPermissionDto: CreateUserPermissionDto,
    tenantId: string,
  ) {
    return await this.userPermissionService.assignPermissionToUser(
      createUserPermissionDto,
      tenantId,
    );
  }

  async assignPermissionToUser1(
    createUserPermissionDto: CreateUserPermissionDto,
    tenantId: string,
  ) {
    return await this.userPermissionService.assignPermissionToUser(
      createUserPermissionDto,
      tenantId,
    );
  }
  async findPermissionsByUserId(id: string) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userPermissions', 'userPermission')
        .leftJoinAndSelect('userPermission.permission', 'permission')
        .where('user.id = :id', { id })
        .getOne();

      if (user) {
        const permissions = user.userPermissions
          .filter((userPermission) => userPermission.permission)
          .map((userPermission) => userPermission.permission);

        delete user.userPermissions;

        return {
          ...user,
          permissions: permissions,
        };
      } else {
        return null;
      }
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }

  async deAttachOneUserPermissionByUserId(
    userId: string,
    permissionId: string,
  ) {
    return await this.userPermissionService.deAttachOneUserPermissionByUserId(
      userId,
      permissionId,
    );
  }

  async findUserByFirbaseId(firbaseId: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { firebaseId: firbaseId },
        relations: ['role', 'userPermissions', 'userPermissions.permission'],
      });

      const department =
        await this.departmentService.findAllDepartmentsByTenantId(
          user.tenantId,
        );
      if (department.length > 0) {
        user['hasCompany'] = true;
      } else {
        user['hasCompany'] = false;
      }

      if (!user) {
        throw new NotFoundException('user not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
  async findUserInfoByArrayOfUserIds(userIds: string[]): Promise<any> {
    try {
      const users = await this.userRepository.find({
        where: { id: In(userIds) },
        relations: ['employeeJobInformation.department'],
      });

      if (!users || users.length === 0) {
        throw new NotFoundException('Users not found');
      }

      const usersInfo = users.map((user: any) => ({
        lastName: user.lastName, // Changed 'users' to 'user'
        firstName: user.firstName, // Changed 'users' to 'user'
        middelName: user.middleName, // Changed 'users' to 'user'
        Avatar: user.profileImage, // Changed 'users' to 'user'
        Email: user.email,
        DepartmentName: user.employeeJobInformation[0]?.department
          ? user.employeeJobInformation[0].department
          : null,
      }));

      return usersInfo; // Return usersInfo instead of users
    } catch (error) {
      throw error;
    }
  }

  async createFromTenant(createUserDto: CreateUserDto, tenantId, role: string) {
    const createRoleDto = new CreateRoleDto();
    createRoleDto.name = role;
    createRoleDto.description = role;
    const createRole = await this.rolesService.createFirstRole(
      createRoleDto,
      tenantId,
    );
    if (createRole) {
      createUserDto.roleId = createRole.id;
      const user = this.userRepository.create({ ...createUserDto, tenantId });
      const password = createUserDto.email + generateRandom4DigitNumber();
      const userRecord = await this.createUserToFirebase(
        createUserDto.email,
        createUserDto.firstName,
        tenantId,
        createUserDto.domainUrl,
      );

      user.firebaseId = userRecord.uid;

      const valuesToCheck = { email: user.email };

      await checkIfDataExists(valuesToCheck, this.userRepository);

      return await this.userRepository.save(user);
    } else {
      throw new NotFoundException('Role Not Found');
    }
  }

  async createUserToFirebase(
    email: string,
    firstName: string,
    tenantId: string,
    domainUrl?: string,
  ) {
    //const password = generateRandom6DigitNumber();
    const password = '%TGBnhy6';
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password.toString(),
    });
    await admin.auth().updateUser(userRecord.uid, { displayName: tenantId });
    const expiresIn = 24 * 60 * 60 * 1000;
    await admin.auth().createCustomToken(userRecord.uid, { expiresIn });
    // const emailTemplatePath = path.join(
    //   process.cwd(),
    //   'src',
    //   'core',
    //   'templates',
    //   'welcome-email-template.html',
    // );

    // let emailHtml = fs.readFileSync(emailTemplatePath, 'utf-8');

    // emailHtml = emailHtml.replace('{{email}}', email);
    // emailHtml = emailHtml.replace('{{name}}', firstName);
    // emailHtml = emailHtml.replace('{{domainUrl}}', domainUrl);
    // emailHtml = emailHtml.replace('{{password}}', password.toString());
    // const emailBody = new CreateEmailDto();
    // emailBody.to = email;
    // emailBody.subject =
    //   'Excited to Have You on Board – Get Started with Selamnew Workspace! ';
    // emailBody.html = emailHtml;

    // const response = await this.httpService
    //   .post(`${this.emailServerUrl}/email`, emailBody)
    //   .toPromise();

    return userRecord;
  }
  async activateUser(userId: string, tenantId: string): Promise<User> {
    try {
      const user = await this.findOne(userId);
      if (user) {
        await this.userRepository.update(userId, { deletedAt: null });
        await this.activateUserFromFirabse(user.firebaseId);
        return user;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async activateUserFromFirabse(firebaseId: string) {
    try {
      await admin.auth().updateUser(firebaseId, {
        disabled: false,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async importUser(importEmployeeDto: ImportEmployeeDto[], tenantId: string) {
    const createdUsers = [];
    const notCreatedUsers = [];
    const singleBankInformation = {};
    const userAddress={}
    try {
      for (const user of importEmployeeDto) {
        try {
          const permissions =
            await this.rolePermissionService.findPermissionsByRole(
              user.roleId,
              tenantId,
            );
          const permissionIds = permissions.map(
            (permission) => permission.permissionId,
          );

          if (user.bankAccountName) {
            singleBankInformation['bankName']=user.bankAccountName;
          }
          if (user.bankAccountNumber) {
            singleBankInformation['accountNumber']=user.bankAccountNumber;
          }
          if(user.phoneNumber){
            userAddress["phoneNumber"]=user.phoneNumber
          }
          if(user.address){
            userAddress["subCity"]=user.address
          }
          const createUserDto = new CreateUserDto();
          createUserDto.firstName = user.firstName;
          createUserDto.middleName = user.middleName;
          createUserDto.lastName = user.lastName;
          createUserDto.roleId = user.roleId;
          createUserDto.email = user.email;

          const employeeInformation = new CreateEmployeeInformationDto();
          employeeInformation.joinedDate = user.joinedDate;
          employeeInformation.gender = user.gender;
          employeeInformation.maritalStatus = user.maritalStatus;
          employeeInformation.nationalityId = user.nationalityId;
          employeeInformation.employeeAttendanceId = parseInt(
            user.employeeAttendanceId,
          );
          employeeInformation.dateOfBirth = user.dateOfBirth || null;
          employeeInformation.bankInformation =
            JSON.stringify(singleBankInformation) || null;
            employeeInformation.addresses= JSON.stringify(userAddress) || null
          const employeeJobInformation = new CreateEmployeeJobInformationDto();
          employeeJobInformation.branchId = user.branchId;
          employeeJobInformation.departmentId = user.departmentId;
          employeeJobInformation.employementTypeId = user.employmentTypeId;
          employeeJobInformation.workScheduleId = user.workScheduleId;
          employeeJobInformation.positionId =
            user.jobPositionId == '' ? null : user.jobPositionId;
          employeeJobInformation.effectiveStartDate =
            new Date(user.joinedDate) || null;
          const createRolePermissionDto = new CreateRolePermissionDto();
          createRolePermissionDto.roleId = user.roleId;
          createRolePermissionDto.permissionId = permissionIds;
          const createUserPermissionDto = new CreateUserPermissionDto();
          createUserPermissionDto.permissionId = permissionIds;
          const bulkCreate = new CreateBulkRequestDto();
          bulkCreate.createUserDto = createUserDto;
          bulkCreate.createEmployeeInformationDto = employeeInformation;
          bulkCreate.createEmployeeJobInformationDto = employeeJobInformation;
          bulkCreate.createRolePermissionDto = createRolePermissionDto;
          bulkCreate.createUserPermissionDto = createUserPermissionDto;

          const userCreated = await this.create(tenantId, bulkCreate);
          createdUsers.push(userCreated);
        } catch (error) {
          notCreatedUsers.push(user);
        }
      }
      return { createdUsers: createdUsers, notCreatedUsers: notCreatedUsers };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOneUSer(id: string, tenantId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id, tenantId: tenantId },
        relations: ['employeeInformation'],
      });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // async  deleteAllFirebaseUsers() {
  //   const admin = require('firebase-admin');
  //   // Initialize Firebase Admin SDK if not already initialized
  //   if (!admin.apps.length) {
  //     admin.initializeApp({
  //       credential: admin.credential.applicationDefault(),
  //     });
  //   }
  
  //   const deleteUsersBatch = async (nextPageToken?: string) => {
  //     const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
  
  //     // Map delete promises
  //     const deletePromises = listUsersResult.users.map((user) =>
  //       admin.auth().deleteUser(user.uid)
  //     );
  
  //     // Wait for all deletions in the current batch
  //     await Promise.all(deletePromises);
  
  //     console.log(`Deleted ${listUsersResult.users.length} users`);
  
  //     // If there's a nextPageToken, process the next batch
  //     if (listUsersResult.pageToken) {
  //       await deleteUsersBatch(listUsersResult.pageToken);
  //     }
  //   };
  
  //   try {
  //     await deleteUsersBatch();
  //     console.log('All users have been successfully deleted.');
  //   } catch (error) {
  //     console.error('Error deleting users:', error);
  //   }
  // }
  
 // Call the function
  
  

  //   async getTenantDomain(

  //     tenantId: string,

  //   ) {
  // try{
  //     const response = await this.httpService
  //       .post(`${this.tenantUrl}/client/${tenantId}`)
  //       .toPromise();

  //     return response.data;
  // }catch(error){
  //   throw new BadRequestException(error.message)
  // }
  //   }
}
