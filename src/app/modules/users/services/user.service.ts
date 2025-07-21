import { DataSource, In } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
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
  generateRandom6DigitNumber,
} from '@root/src/core/utils/generateRandomNumbers';
import filterEntities from '@root/src/core/utils/filters.utils';
import { FilterDto } from '../dto/filter-status-user.dto';
import * as admin from 'firebase-admin';
import { CreateUserDto } from '../dto/create-user.dto';
import { RoleService } from '../../role/role.service';
import { CreateRoleDto } from '../../role/dto/create-role.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CreateEmailDto } from '../dto/create-email.dto';
import * as fs from 'fs';
import * as path from 'path';
import { ImportEmployeeDto } from '../dto/import-user.dto';
import { JobPositionService } from '../../job-position/job-position.service';
import { BranchesService } from '../../branchs/branches.service';
import { EmployementTypeService } from '../../employment-type/employement-type.service';
import { WorkSchedulesService } from '../../work-schedules/work-schedules.service';
import { NationalityService } from '../../nationality/nationality.service';
import { EmployeeInformation } from '../../employee-information/entities/employee-information.entity';
import { CreateEmployeeInformationDto } from '../../employee-information/dto/create-employee-information.dto';
import { CreateEmployeeJobInformationDto } from '../../employee-job-information/dto/create-employee-job-information.dto';
import { CreateRolePermissionDto } from '../../role-permission/dto/create-role-permission.dto';
import { FilterEmailDto } from '../dto/email.dto';
import { DelegationService } from '../../delegations/delegations.service';
import { FirebaseAuthService } from '@root/src/core/firebaseAuth/firbase-auth.service';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { OtherServiceDependenciesService } from '../../other-service-dependencies/other-service-dependencies.service';
import { ExportUserDto, DownloadFormat } from '../dto/export-user.dto';
import * as PDFDocument from 'pdfkit';
import * as ExcelJS from 'exceljs';
import { generateExportFile } from '@root/src/core/utils/export/export-user-data.util';

@Injectable()
export class UserService {
  private readonly emailServerUrl: string;
  // private readonly tenantUrl:string;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    private readonly delegationService: DelegationService,

    private readonly httpService: HttpService,
    private readonly firebaseAuthService: FirebaseAuthService,
    private readonly otherServiceDependenciesService: OtherServiceDependenciesService,
  ) {
    this.emailServerUrl = this.configService.get<string>(
      'servicesUrl.emailUrl',
    );
    // this.tenantUrl = this.configService.get<string>(
    //   'servicesUrl.tenantUrl',
    // );
  }

  async updateProfileImage(
    tenantId: string,
    userId: string,
    profileImage: Express.Multer.File,
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, tenantId },
      });
      if (!user) throw new NotFoundException('User not found');

      const uploadedImagePath = await this.fileUploadService
        .uploadFileToServer(tenantId, profileImage)
        .catch((error) => {
          if (error.code === 'ENOTFOUND') {
            throw new ConflictException(
              'File server is unreachable. Please try again later.',
            );
          }
          throw new ConflictException(
            'Failed to upload file. Please try again later.',
          );
        });

      user.profileImage = uploadedImagePath['viewImage'];
      user.profileImageDownload = uploadedImagePath['image'];
      await this.userRepository.save(user);

      return {
        message: 'Profile image updated successfully',
        profileImageUrl: user.profileImage,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the profile image. Please try again.',
      );
    }
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
    let firebaseRecordId: string = null;

    try {
      const {
        createUserDto,
        createRolePermissionDto,
        createUserPermissionDto,
        createEmployeeInformationDto,
        createEmployeeJobInformationDto,
        createEmployeeDocumentDto,
      } = createBulkRequestDto;

      if (profileImage && profileImage.buffer) {
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
      firebaseRecordId = userRecord.uid;
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
      createEmployeeInformationDto.joinedDate =
        createEmployeeJobInformationDto?.effectiveStartDate;

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
          tenantId,
          documentName,
        );
      }

      await queryRunner.commitTransaction();

      return await this.findOne(result.id);
    } catch (error) {
      if (firebaseRecordId) {
        await admin.auth().deleteUser(firebaseRecordId);
      }
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
        ...(filterDto.gender && {
          'employeeInformation.gender': filterDto.gender,
        }),
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
        .leftJoinAndSelect(
          'user.basicSalaries',
          'basicSalaries',
          'basicSalaries.status = :status',
          { status: true },
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

      // Add gender filter
      if (filterDto.gender) {
        queryBuilder.andWhere('employeeInformation.gender = :gender', {
          gender: filterDto.gender,
        });
      }

      // Add joined date filters
      if (filterDto.joinedDateAfter) {
        queryBuilder.andWhere(
          'employeeInformation.joinedDate >= :joinedDateAfter',
          {
            joinedDateAfter: new Date(filterDto.joinedDateAfter),
          },
        );
      }

      if (filterDto.joinedDateBefore) {
        queryBuilder.andWhere(
          'employeeInformation.joinedDate <= :joinedDateBefore',
          {
            joinedDateBefore: new Date(filterDto.joinedDateBefore),
          },
        );
      }

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

  async findAllWithOutFilter(
    paginationOptions: PaginationDto,
    tenantId: string,
  ) {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = await this.userRepository
        .createQueryBuilder('user')

        .withDeleted()
        .leftJoinAndSelect(
          'user.employeeJobInformation',
          'employeeJobInformation',
          'employeeJobInformation.isPositionActive = :isPositionActive',
          { isPositionActive: true },
        )
        .leftJoinAndSelect(
          'user.basicSalaries',
          'basicSalaries',
          'basicSalaries.status = :status',
          { status: true },
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

      const paginatedData = await this.paginationService.paginate<User>(
        queryBuilder,
        options,
      );

      return paginatedData;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User not found.`);
      }
      throw error;
    }
  }

  async findAllPayRollUsers(
    paginationOptions: PaginationDto,
    tenantId: string,
  ) {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect(
          'user.employeeJobInformation',
          'employeeJobInformation',
          'employeeJobInformation.isPositionActive = :isPositionActive',
          { isPositionActive: true },
        )
        .leftJoinAndSelect(
          'user.basicSalaries',
          'basicSalaries',
          'basicSalaries.status = :status',
          { status: true },
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

      const paginatedData = await this.paginationService.paginate<User>(
        queryBuilder,
        options,
      );

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

  async findAllUsersByAllDepartment(tenantId: string, departmentIds: string[]) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect(
        'user.employeeJobInformation',
        'employeeJobInformation',
      )
      .where('employeeJobInformation.departmentId IN (:...departmentIds)', {
        departmentIds,
      })
      .andWhere('employeeJobInformation.isPositionActive = true')
      .andWhere('user.deletedAt IS NULL')
      .andWhere('employeeJobInformation.deletedAt IS NULL')
      .andWhere('employeeJobInformation.tenantId = :tenantId', { tenantId })
      .getMany();

    return users;
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.employeeDocument', 'employeeDocument')
        .leftJoinAndSelect('user.employeeInformation', 'employeeInformation')
        .withDeleted()
        .leftJoinAndSelect(
          'user.employeeJobInformation',
          'employeeJobInformation',
          'employeeJobInformation.isPositionActive = :isPositionActive',
          { isPositionActive: true },
        )
        .leftJoinAndSelect(
          'user.basicSalaries',
          'basicSalaries',
          'basicSalaries.status = :status',
          { status: true },
        )
        .leftJoinAndSelect(
          'employeeJobInformation.employementType',
          'employementType',
        )
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
        .leftJoinAndSelect('userPermissions.permission', 'permission')
        .where('user.id = :id', { id })
        .getOne();

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      user['reportingTo'] = await this.assignReportsTo(id);

      return { ...user };
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }

  async revokeUserSession(uid: string) {
    try {
      await admin.auth().revokeRefreshTokens(uid);

      const user = await admin.auth().getUser(uid);

      return {
        message: 'User session revoked successfully',
        tokensValidAfterTime: user.tokensValidAfterTime,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to revoke user session');
    }
  }

  async update(
    id: string,
    tenantId: string,
    updateUserDto: UpdateUserDto,
    profileImage?: Express.Multer.File,
  ) {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id, tenantId },
      });
      if (!user) {
        throw new NotFoundException('User Not Found');
      }

      if (profileImage) {
        const uploadedImagePath = await this.fileUploadService
          .uploadFileToServer(tenantId, profileImage)
          .catch((error) => {
            if (error.code === 'ENOTFOUND') {
              throw new ConflictException(
                'File server is unreachable. Please try again later.',
              );
            }
            throw new ConflictException(
              'Failed to upload file. Please try again later.',
            );
          });

        updateUserDto.profileImage = uploadedImagePath['viewImage'];
        updateUserDto.profileImageDownload = uploadedImagePath['image'];
      }

      if (updateUserDto.permission) {
        const createPremission = new CreateUserPermissionDto();
        createPremission.permissionId = updateUserDto.permission
          ? updateUserDto.permission
          : [];
        createPremission.userId = id;
        delete updateUserDto.permission;

        if (
          createPremission.permissionId.length > 0 &&
          createPremission.permissionId
        ) {
          await this.userPermissionService.update(
            id,
            createPremission,
            tenantId,
          );
        }
      }
      if (updateUserDto?.roleId || updateUserDto?.permission) {
        const firebaseUid = user?.firebaseId;
        if (firebaseUid) {
          await this.revokeUserSession(firebaseUid);
        }
      }
      await this.userRepository.update({ id }, updateUserDto);

      return await this.userRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw new InternalServerErrorException(
        'An error occurred while updating the user. Please try again.',
      );
    }
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

      // Check if employeeJobInformation exists and has elements
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
          } else {
            return null;
          }
        } else {
          return await this.findTeamLeadOrNot(jobInfo.departmentId);
        }
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

  async createFromTenant(
    createUserDto: CreateUserDto,
    tenantId: string,
    role: string,
  ) {
    let firebaseRecordId: string = null;
    try {
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
        const url = createUserDto.domainUrl.replace('https://', '');
        const domainRegistered = await this.addAuthorizedDomain(url);
        const password = createUserDto.email + generateRandom4DigitNumber();
        const userRecord = await this.createUserToFirebase(
          createUserDto.email,
          createUserDto.firstName,
          tenantId,
          createUserDto.domainUrl,
        );
        firebaseRecordId = userRecord.uid;
        user.firebaseId = userRecord.uid;

        const valuesToCheck = { email: user.email };

        await checkIfDataExists(valuesToCheck, this.userRepository);

        return await this.userRepository.save(user);
      } else {
        if (firebaseRecordId) {
          await admin.auth().deleteUser(firebaseRecordId);
        }
        throw new NotFoundException('Role Not Found');
      }
    } catch (error) {
      if (firebaseRecordId) {
        await admin.auth().deleteUser(firebaseRecordId);
      }
      throw new BadRequestException(error.message);
    }
  }

  async createUserToFirebase(
    email: string,
    firstName: string,
    tenantId: string,
    domainUrl?: string,
  ) {
    const password = generateRandom6DigitNumber();
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password.toString(),
    });
    await admin.auth().updateUser(userRecord.uid, { displayName: tenantId });
    const expiresIn = 24 * 60 * 60 * 1000;
    await admin.auth().createCustomToken(userRecord.uid, { expiresIn });
    const emailTemplatePath = path.join(
      process.cwd(),
      'src',
      'core',
      'templates',
      'welcome-email-template.html',
    );

    let emailHtml = fs.readFileSync(emailTemplatePath, 'utf-8');

    emailHtml = emailHtml.replace('{{email}}', email);
    emailHtml = emailHtml.replace('{{name}}', firstName);
    emailHtml = emailHtml.replace('{{domainUrl}}', domainUrl);
    emailHtml = emailHtml.replace('{{password}}', password.toString());
    const emailBody = new CreateEmailDto();
    emailBody.to = email;
    emailBody.subject =
      'Excited to Have You on Board – Get Started with Selamnew Workspace! ';
    emailBody.html = emailHtml;

    const response = await this.httpService
      .post(`${this.emailServerUrl}/email`, emailBody)
      .toPromise();

    return userRecord;
  }

  async addAuthorizedDomain(domain: string) {
    try {
      const firebaseAuth = await this.firebaseAuthService.addAuthorizedDomain(
        domain,
      );
      return firebaseAuth;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
    const userAddress = {};
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
            singleBankInformation['bankName'] = user.bankAccountName;
          }
          if (user.bankAccountNumber) {
            singleBankInformation['accountNumber'] = user.bankAccountNumber;
          }
          if (user.phoneNumber) {
            userAddress['phoneNumber'] = user.phoneNumber;
          }
          if (user.address) {
            userAddress['subCity'] = user.address;
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
          employeeInformation.addresses = JSON.stringify(userAddress) || null;
          JSON.parse(employeeInformation.addresses);
          JSON.parse(employeeInformation.bankInformation);
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
  async getAllUser(tenantId: string) {
    try {
      const user = await this.userRepository.find({
        where: { tenantId: tenantId },
        relations: ['employeeInformation'],
      });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getAllUsersWithNetPay(tenantId: string): Promise<User[]> {
    try {
      const user = await this.userRepository.find({
        where: { tenantId: tenantId },
        relations: [
          'employeeInformation',
          'basicSalaries',
          'employeeJobInformation',
          'employeeJobInformation.position',
        ],
      });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllUSerIds() {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.firstName'])
        .getMany();

      return users;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneUserJobInfo(userId: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .withDeleted()
      .leftJoinAndSelect(
        'user.employeeJobInformation',
        'employeeJobInformation',
        'employeeJobInformation.isPositionActive = :isPositionActive',
        { isPositionActive: true },
      )
      .where('user.id = :id', { id: userId })
      .getOne();

    return user;
  }
  async findUserByEmail(email: FilterEmailDto, tenantId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email.email, tenantId: tenantId },
      });

      return user;
    } catch (error) {
      throw new NotFoundException('User Not Found');
    }
  }
  async findUserByEmailWithOutTenantID(email: FilterEmailDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email.email },
      });

      return user;
    } catch (error) {
      throw new NotFoundException('User Not Found');
    }
  }
  async assignReportsTo(userId: string) {
    try {
      let reportingToUser = await this.findReportingToUser(userId);
      const getDelegation = await this.delegationService.findUserOnLeaveById(
        reportingToUser.id,
      );
      if (getDelegation) {
        if (getDelegation.delegatee.id !== userId) {
          reportingToUser = getDelegation.delegatee;
        } else {
          reportingToUser = await this.findReportingToUser(
            getDelegation.delegatorId,
          );
        }
      }

      return reportingToUser;
    } catch (error) {
      return null;
    }
  }

  async getAllUsersJoinedDate(tenantId: string) {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.employeeInformation', 'employeeInformation')
        .where('user.tenantId = :tenantId', { tenantId })
        .select(['user.id', 'employeeInformation.joinedDate'])
        .getMany();

      return users.map((user) => ({
        userId: user.id,
        joinedDate: user.employeeInformation?.joinedDate || null,
      }));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
    try {
      const actionCodeSettings = {
        url: resetPasswordDto.url,
        handleCodeInApp: true,
      };
      const userData = await this.findUserByEmailWithOutTenantID({
        email: resetPasswordDto?.email,
      });
      if (userData.tenantId !== resetPasswordDto?.loginTenantId) {
        throw new BadRequestException('User does not belong to this tenant');
      }
      const resetLink = await admin
        .auth()
        .generatePasswordResetLink(resetPasswordDto.email, actionCodeSettings);

      const url = new URL(resetLink, `${resetPasswordDto.url}`);
      const oobCode = url.searchParams.get('oobCode');
      const mode = url.searchParams.get('mode');
      const apiKey = url.searchParams.get('apiKey');
      const lang = url.searchParams.get('lang');

      const finalResetLink = `${resetPasswordDto.url}?apiKey=${apiKey}&mode=${mode}&oobCode=${oobCode}&lang=${lang}`;

      if (finalResetLink) {
        try {
          await this.otherServiceDependenciesService.sendResetPasswordEmail(
            finalResetLink,
            resetPasswordDto.email,
          );
          return 'Reset email sent successfully.';
        } catch (error) {
          throw new BadRequestException(
            `Error Sending Email: ${error.message}`,
          );
        }
      } else {
        throw new BadRequestException(`Can Not Create Reset Link`);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

async exportUserData(
  tenantId: string,
  exportUserDto: ExportUserDto,
): Promise<{ fileUrl: string }> {
  let queryBuilder = this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect(
      'user.employeeJobInformation',
      'employeeJobInformation',
      'employeeJobInformation.isPositionActive = :isPositionActive',
      { isPositionActive: true },
    )
    .leftJoinAndSelect('employeeJobInformation.position', 'position')
    .leftJoinAndSelect('employeeJobInformation.department', 'department')
    .leftJoinAndSelect('employeeJobInformation.branch', 'branch')
    .leftJoinAndSelect(
      'employeeJobInformation.basicSalaries',
      'jobBasicSalaries',
    )
    .leftJoinAndSelect('user.employeeInformation', 'employeeInformation')
    .leftJoinAndSelect('user.role', 'role')
    .andWhere('user.tenantId = :tenantId', { tenantId });

  // Apply filters based on ExportUserDto fields
  if (exportUserDto.employee_name) {
    queryBuilder = queryBuilder.andWhere(
      `(user.firstName ILIKE :name OR user.lastName ILIKE :name OR user.middleName ILIKE :name)`,
      { name: `%${exportUserDto.employee_name}%` },
    );
  }
  if (exportUserDto.allOffices) {
    queryBuilder = queryBuilder.andWhere(
      'employeeJobInformation.branchId = :branchId',
      { branchId: exportUserDto.allOffices },
    );
  }
  if (exportUserDto.allJobs) {
    queryBuilder = queryBuilder.andWhere(
      'employeeJobInformation.departmentId = :departmentId',
      { departmentId: exportUserDto.allJobs },
    );
  }
  if (exportUserDto.allStatus) {
    if (exportUserDto.allStatus === 'notNull') {
      queryBuilder = queryBuilder.andWhere('user.deletedAt IS NOT NULL');
    } else if (exportUserDto.allStatus === 'null') {
      queryBuilder = queryBuilder.andWhere('user.deletedAt IS NULL');
    }
  }
  if (exportUserDto.gender) {
    queryBuilder = queryBuilder.andWhere(
      'employeeInformation.gender = :gender',
      { gender: exportUserDto.gender },
    );
  }
  if (exportUserDto.joinedDate) {
    if (exportUserDto.joinedDateType === 'after') {
      queryBuilder = queryBuilder.andWhere(
        'employeeInformation.joinedDate >= :joinedDate',
        { joinedDate: exportUserDto.joinedDate },
      );
    } else if (exportUserDto.joinedDateType === 'before') {
      queryBuilder = queryBuilder.andWhere(
        'employeeInformation.joinedDate <= :joinedDate',
        { joinedDate: exportUserDto.joinedDate },
      );
    }
  }

  const users = await queryBuilder.getMany();

  // Prepare data for export (include salary details)
  const exportData = users.map((user) => {
    const jobInfo = user.employeeJobInformation?.[0];
    // Format joinedDate as dd-mm-YYYY
    let formattedDate = '';
    if (user.employeeInformation?.joinedDate) {
      const d = new Date(user.employeeInformation.joinedDate);
      const pad = (n) => n.toString().padStart(2, '0');
      formattedDate = `${pad(d.getDate())}-${pad(
        d.getMonth() + 1,
      )}-${d.getFullYear()}`;
    }
    // Get basicSalary with status true from jobInfo.basicSalaries
    let basicSalary = '';
    if (Array.isArray(jobInfo?.basicSalaries)) {
      const salaryObj = jobInfo.basicSalaries.find(
        (item) => item && item.status === true,
      );
      basicSalary =
        salaryObj &&
        salaryObj.basicSalary !== undefined &&
        salaryObj.basicSalary !== null
          ? salaryObj.basicSalary.toString()
          : '';
    }
    return {
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      role: user.role?.name,
      jobTitle: jobInfo?.position?.name,
      department: jobInfo?.department?.name,
      branch: jobInfo?.branch?.name,
      joinedDate: formattedDate,
      basicSalary: basicSalary,
    };
  });

  // Define columns for export
  const columns = [
    { header: 'First Name', key: 'firstName', width: 11 },
    { header: 'Middle Name', key: 'middleName', width: 11 },
    { header: 'Last Name', key: 'lastName', width: 11 },
    { header: 'Email', key: 'email', width: 16 },
    { header: 'Role', key: 'role', width: 10 },
    { header: 'Job Title', key: 'jobTitle', width: 12 },
    { header: 'Department', key: 'department', width: 12 },
    { header: 'Branch', key: 'branch', width: 12 },
    { header: 'Joined Date', key: 'joinedDate', width: 12 },
    { header: 'Basic Salary', key: 'basicSalary', width: 10 },
  ];

  // Generate file (Excel or PDF) using utility
  const { buffer, fileName, mimetype } = await generateExportFile({
    columns,
    exportData,
    exportUserDto,
  });

  // Create a mock Express.Multer.File object
  const file: Express.Multer.File = {
    fieldname: 'file',
    originalname: fileName,
    encoding: '7bit',
    mimetype,
    size: buffer.length,
    destination: '',
    filename: fileName,
    path: '',
    buffer,
    stream: undefined as any,
  };

  // Upload to file server
  const uploadResult = await this.fileUploadService.uploadFileToServer(
    tenantId,
    file,
  );
  const fileUrl = uploadResult?.viewImage || uploadResult?.image;
  return { fileUrl };
}
}
