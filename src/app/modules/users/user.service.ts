import { DataSource } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeDocumentService } from './../employee-documents/employee-document.service';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { checkIfDataExists } from '@root/src/core/utils/checkIfDataExists.util';
import { EmployeeInformationService } from '../employee-information/employee-information.service';
import { EmployeeJobInformationService } from '../employee-job-information/employee-job-information.service';
import { QueryRunner, Repository } from 'typeorm';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { FileUploadService } from '@root/src/core/commonServices/upload.service';
import { CreateUserPermissionDto } from '../user-permission/dto/create-user-permission.dto';
import { UserPermissionService } from '../user-permission/user-permission.service';
import { FilterUsertDto } from './dto/filter-user.dto';
import { DepartmentsService } from '../departments/departments.service';
import { FilterStatusDto } from './dto/filter-status-user.dto';
import { CreateBulkRequestDto } from './createBulkRequest.dto';
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
  ) { }

  async create(tenantId: string, createBulkRequestDto: CreateBulkRequestDto, profileImage: Express.Multer.File, documentName: Express.Multer.File) {

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction()

    try {

      const { createUserDto, createRolePermissionDto, createUserPermissionDto, createEmployeeInformationDto, createEmployeeJobInformationDto, createEmployeeDocumentDto } = createBulkRequestDto;

      const uploadedImagePath = await this.fileUploadService.uploadFileToServer(tenantId, profileImage);

      createUserDto['profileImage'] = uploadedImagePath['viewImage'];

      createUserDto['profileImageDownload'] = uploadedImagePath['image'];

      const user = this.userRepository.create({ ...createUserDto, tenantId });

      const valuesToCheck = { email: user.email };

      await checkIfDataExists(valuesToCheck, this.userRepository);

      const result = await this.userRepository.save(user);

      await this.rolePermissionService.updateRolePermissions(createRolePermissionDto['roleId'], createRolePermissionDto['permissionId'], tenantId)

      createUserPermissionDto['userId'] = result.id;

      createUserPermissionDto['permissionId'] = createUserPermissionDto.permissionId;

      await this.assignPermissionToUser(createUserPermissionDto, tenantId);

      createEmployeeInformationDto['userId'] = result.id;

      const employeeInformation = await this.employeeInformationService.create(createEmployeeInformationDto, tenantId);

      createEmployeeJobInformationDto['userId'] = result.id;

      await this.employeeJobInformationService.create(createEmployeeJobInformationDto, tenantId);

      createEmployeeDocumentDto['userId'] = result.id;

      createEmployeeDocumentDto['employeeInformationId'] = employeeInformation.id;

      await this.employeeDocumentService.create(createEmployeeDocumentDto, documentName, tenantId);

      await queryRunner.commitTransaction();

      return await this.findOne(result.id);

    } catch (error) {

      await queryRunner.rollbackTransaction();

      throw new ConflictException(error);

    } finally {

      await queryRunner.release();
    }
  }

  async findAll(paginationOptions: PaginationDto, tenantId: string) {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect(
          'user.employeeJobInformation',
          'employeeJobInformation',
          'employeeJobInformation.isPositionActive = :isPositionActive',
          { isPositionActive: true },
        )
        .leftJoinAndSelect(
          'employeeJobInformation.employmentType',
          'employmentType',
        )
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('user.employeeInformation', 'employeeInformation')
        .leftJoinAndSelect('employeeJobInformation.branch', 'branch')
        .leftJoinAndSelect('employeeJobInformation.department', 'department')
        .where('user.tenantId = :tenantId', { tenantId });

      const paginatedData = await this.paginationService.paginate<User>(
        queryBuilder,
        options,
      );

      for (const user of paginatedData.items) {
        if (user.employeeJobInformation && user.employeeJobInformation.length > 0) {
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


  async findOne(id: string) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect(
          'user.employeeJobInformation',
          'employeeJobInformation',
        )
        .leftJoinAndSelect(
          'employeeJobInformation.employmentType',
          'employmentType',
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.userRepository.findOneOrFail({ where: { id: id } });
      await this.userRepository.update({ id }, updateUserDto);
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
      await this.userRepository.findOneOrFail({ where: { id: id } });
      return await this.userRepository.softDelete({ id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }
  async searchUsers(
    filterUsertDto: FilterUsertDto,
    paginationOptions: PaginationDto,
    tenantId: string,
  ): Promise<Pagination<User>> {
    try {
      const filterableFields = ['firstName', 'middleName', 'lastName', 'email'];
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect(
          'user.employeeJobInformation',
          'employeeJobInformation',
          'employeeJobInformation.isPositionActive = :isPositionActive',
          { isPositionActive: true },
        )
        .leftJoinAndSelect('user.employeeInformation', 'employeeInformation')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect(
          'employeeJobInformation.employmentType',
          'employmentType',
        )
        .leftJoinAndSelect('employeeInformation.nationality', 'nationality')
        .leftJoinAndSelect('employeeJobInformation.branch', 'branch')
        .leftJoinAndSelect('employeeJobInformation.department', 'department')
        .where('user.tenantId = :tenantId', { tenantId });

      const { searchString } = filterUsertDto;
      if (searchString) {
        const lowerCaseSearchString = searchString.toLowerCase();

        const searchConditions = filterableFields
          .map((field) => `LOWER(user.${field}) LIKE :searchString`)
          .join(' OR ');
        queryBuilder.andWhere(`(${searchConditions})`, {
          searchString: `%${lowerCaseSearchString}%`,
        });
      }
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };

      const paginatedData = await this.paginationService.paginate<User>(
        queryBuilder,
        options,
      );

      for (const user of paginatedData.items) {
        user.employeeJobInformation[0] = user.employeeJobInformation[0];
      }

      return paginatedData;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User not found.`);
      }
      throw error;
    }
  }

  async findReportingToUser(id: string) {
    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
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
      if (user.employeeJobInformation && user.employeeJobInformation.length > 0) {
        const jobInfo = user.employeeJobInformation[0];

        if (jobInfo.departmentLeadOrNot === true) {
          const department = await this.departmentService.findAncestor(jobInfo.departmentId);
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
          throw new NotFoundException(
            `No team lead found for department with id ${departmentId}`,
          );
        }
      }
    } catch (error) {
      throw new NotFoundException(`No Team Lead Found`);
    }
  }

  async getAllBranchEmployees(
    branchId: string,
    tenantId: string,
    paginationOptions: PaginationDto,
  ): Promise<Pagination<User>> {
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
        .leftJoinAndSelect('user.employeeInformation', 'employeeInformation')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect(
          'employeeJobInformation.employmentType',
          'employmentType',
        )
        .leftJoinAndSelect('employeeInformation.nationality', 'nationality')
        .leftJoinAndSelect('employeeJobInformation.branch', 'branch')
        .leftJoinAndSelect('employeeJobInformation.department', 'department')
        .where('employeeJobInformation.branchId = :branchId', { branchId })
        .andWhere('employeeJobInformation.tenantId = :tenantId', { tenantId });
      const users = await queryBuilder.getMany();
      const paginatedData = await this.paginationService.paginate<User>(
        queryBuilder,
        options,
      );
      for (const user of paginatedData.items) {
        user.employeeJobInformation[0] = user.employeeJobInformation[0];
      }
      return paginatedData;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `EmployeeJobInformation with branch ${branchId} not found.`,
        );
      }
      throw error;
    }
  }

  async getAllDepartmentEmployees(
    departmentId: string,
    tenantId: string,
    paginationOptions: PaginationDto,
  ): Promise<Pagination<User>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect(
          'user.employeeJobInformation',
          'employeeJobInformation',
          'employeeJobInformation.isPositionActive = :isPositionActive',
          { isPositionActive: true },
        )
        .leftJoinAndSelect('user.employeeInformation', 'employeeInformation')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect(
          'employeeJobInformation.employmentType',
          'employmentType',
        )
        .leftJoinAndSelect('employeeInformation.nationality', 'nationality')
        .leftJoinAndSelect('employeeJobInformation.branch', 'branch')
        .leftJoinAndSelect('employeeJobInformation.department', 'department')
        .where('employeeJobInformation.departmentId = :departmentId', {
          departmentId,
        })
        .andWhere('employeeJobInformation.tenantId = :tenantId', { tenantId });

      const paginatedData = await this.paginationService.paginate<User>(
        queryBuilder,

        options,
      );
      for (const user of paginatedData.items) {
        user.employeeJobInformation[0] = user.employeeJobInformation[0];
      }
      return paginatedData;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `EmployeeJobInformation with branch ${departmentId} not found.`,
        );
      }
      throw error;
    }
  }

  async getAllActiveEmployees(
    tenantId: string,
    filterStatusDto: FilterStatusDto,
    paginationOptions: PaginationDto,
  ): Promise<Pagination<User>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect(
          'user.employeeJobInformation',
          'employeeJobInformation',
          'employeeJobInformation.isPositionActive = :isPositionActive',
          { isPositionActive: true },
        )
        .leftJoinAndSelect('user.employeeInformation', 'employeeInformation')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect(
          'employeeJobInformation.employmentType',
          'employmentType',
        )
        .leftJoinAndSelect('employeeInformation.nationality', 'nationality')
        .leftJoinAndSelect('employeeJobInformation.branch', 'branch')
        .leftJoinAndSelect('employeeJobInformation.department', 'department')
        .andWhere('employeeJobInformation.tenantId = :tenantId', { tenantId });
      if (filterStatusDto.status === false) {
        queryBuilder.andWhere('user.deletedAt IS NOT NULL');
      } else if (filterStatusDto.status === true) {
        queryBuilder.andWhere('user.deletedAt IS NULL');
      } else {
        queryBuilder.andWhere(
          'user.deletedAt IS NOT NULL OR user.deletedAt IS NULL',
        );
      }
      queryBuilder.getQuery();
      const paginatedData = await this.paginationService.paginate<User>(
        queryBuilder,

        options,
      );
      for (const user of paginatedData.items) {
        user.employeeJobInformation[0] = user.employeeJobInformation[0];
      }
      return paginatedData;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`EmployeeJobInformation  Not Found.`);
      }
      throw new BadRequestException(error);
    }
  }

  async assignPermissionToUser(
    createUserPermissionDto: CreateUserPermissionDto, tenantId: string
  ) {
    return await this.userPermissionService.assignPermissionToUser(
      createUserPermissionDto, tenantId
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
}
