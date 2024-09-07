import { DataSource } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeDocumentService } from './../employee-documents/employee-document.service';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { checkIfDataExists } from '@root/src/core/utils/checkIfDataExists.util';
import { EmployeeInformationService } from '../employee-information/employee-information.service';
import { EmployeeJobInformationService } from '../employee-job-information/employee-job-information.service';
import { QueryRunner, Repository } from 'typeorm';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { FileUploadService } from '@root/src/core/upload/upload.service';
import { CreateUserPermissionDto } from '../user-permission/dto/create-user-permission.dto';
import { UserPermissionService } from '../user-permission/user-permission.service';
import { DepartmentsService } from '../departments/departments.service';
import { CreateBulkRequestDto } from './dto/createBulkRequest.dto';
import { generateRandom4DigitNumber } from '@root/src/core/utils/generateRandomNumbers';
import filterEntities from '@root/src/core/utils/filters.utils';
import { FilterDto } from './dto/filter-status-user.dto';
import * as admin from 'firebase-admin';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleService } from '../role/role.service';
import { CreateRoleDto } from '../role/dto/create-role.dto';
import { EmployeeTerminationService } from '../employee-termination/employee-termination.service';

@Injectable()
export class UserService {
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
    private readonly departmentService: DepartmentsService,
    private readonly rolesService: RoleService,
  ) { }

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

      const uploadedImagePath = await this.fileUploadService.uploadFileToServer(
        tenantId,
        profileImage,
      );

      createUserDto['profileImage'] = uploadedImagePath['viewImage'];

      createUserDto['profileImageDownload'] = uploadedImagePath['image'];
      const user = this.userRepository.create({ ...createUserDto, tenantId });
      const password = createUserDto.email + generateRandom4DigitNumber();

      const userRecord = await this.createUserToFirebase(
        createUserDto.email,
        tenantId,
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

      createEmployeeDocumentDto['userId'] = result.id;

      createEmployeeDocumentDto['employeeInformationId'] =
        employeeInformation.id;

      await this.employeeDocumentService.create(
        createEmployeeDocumentDto,
        documentName,
        tenantId,
      );

      await queryRunner.commitTransaction();

      return await this.findOne(result.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new ConflictException(error);
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
  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
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
        .leftJoinAndSelect('employeeJobInformation.department', 'department')
        .leftJoinAndSelect('user.employeeDocument', 'employeeDocument')
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
      createPremission.permissionId = updateUserDto.permission;
      createPremission.userId = id;
      delete updateUserDto.permission;
      await this.userRepository.findOneOrFail({ where: { id: id } });
      await this.userRepository.update({ id }, updateUserDto);
      await this.userPermissionService.update(id, createPremission, tenantId);
      return await this.userRepository.findOneOrFail({ where: { id: id } });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
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
          }
        }
        return await this.findTeamLeadOrNot(jobInfo.departmentId);
      }
    } catch (error) {
      throw error;
    }
  }

  private async findTeamLeadOrNot(departmentId: string): Promise<any> {
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
        relations: ['role', 'userPermissions'],
      });
      if (!user) {
        throw new NotFoundException('user not found');
      }

      return user;
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
        tenantId,
      );

      user.firebaseId = userRecord.uid;

      const valuesToCheck = { email: user.email };

      await checkIfDataExists(valuesToCheck, this.userRepository);

      return await this.userRepository.save(user);
    } else {
      throw new NotFoundException('Role Not Found');
    }
  }

  async createUserToFirebase(email: string, tenantId: string) {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: '123456789',
    });

    await admin.auth().updateUser(userRecord.uid, { displayName: tenantId });
    const expirationTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60);

    const additionalClaims = {
      exp: expirationTime,
    };
    await admin.auth().createCustomToken(userRecord.uid, additionalClaims);
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
}
