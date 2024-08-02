// import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import {
  Body,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryRunner, Repository } from 'typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { checkIfDataExists } from '@root/src/core/utils/checkIfDataExists.util';
import { EmployeeInformationService } from '../employee-information/employee-information.service';
import { EmployeeJobInformationService } from '../employee-job-information/employee-job-information.service';
import { EmployeeInformationFormService } from '../employee-information-form/employee-information-form.service';
import { EmployementTypeService } from '../employment-type/employement-type.service';
import { NationalityService } from '../nationality/nationality.service';
import { PermissionService } from '../permission/permission.service';
import { RoleService } from '../role/role.service';
import { PermissionGroupService } from '../permission-group/permission-group.service';
import { CreateEmployeeInformationDto } from '../employee-information/dto/create-employee-information.dto';
import { CreateEmployeeJobInformationDto } from '../employee-job-information/dto/create-employee-job-information.dto';
import { CreateEmployeeInformationFormDto } from '../employee-information-form/dto/create-employee-information-form.dto';
import { CreateNationalityDto } from '../nationality/dto/create-nationality.dto';
import { CreatePermissionDto } from '../permission/dto/create-permission.dto';
import { CreatePermissionGroupDto } from '../permission-group/dto/create-permission-group.dto';
import { CreateRoleDto } from '../role/dto/create-role.dto';
import { CreateEmployementTypeDto } from '../employment-type/dto/create-employement-type.dto';
import { CreateBulkRequestDto } from '@root/src/core/commonDto/createBulkRequest.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
    private readonly employeeInformationService: EmployeeInformationService,
    private readonly employeeJobInformationService: EmployeeJobInformationService,
    private readonly employeeInformationFormService: EmployeeInformationFormService,
    private readonly nationalityService: NationalityService,
    private readonly permissionService: PermissionService,
    private readonly permissionGroupService: PermissionGroupService,
    private readonly roleService: RoleService,
    private readonly employementTypeService: EmployementTypeService
  ) { }

  async create(tenantId: string, createBulkRequestDto: CreateBulkRequestDto) {
    // const queryRunner: QueryRunner = getConnection().createQueryRunner();

    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    try {
      const { createUserDto, createEmployeeInformationDto, createEmployeeJobInformationDto, createEmployeeInformationFormDto } = createBulkRequestDto;
      const user = this.userRepository.create({ ...createUserDto, tenantId });

      // Check for existing data
      const valuesToCheck = { email: user.email };
      await checkIfDataExists(valuesToCheck, this.userRepository);
      const result = await this.userRepository.save(user);

      // Perform other service operations within the transaction
      createEmployeeInformationDto['userId'] = result.id;
      await this.employeeInformationService.create(createEmployeeInformationDto, tenantId);

      createEmployeeJobInformationDto['userId'] = result.id;
      await this.employeeJobInformationService.create(createEmployeeJobInformationDto, tenantId);

      await this.employeeInformationFormService.create(createEmployeeInformationFormDto, tenantId);

      // Commit the transaction
      // await queryRunner.commitTransaction();

      return result;

    } catch (error) {
      // Rollback the transaction if any operation fails
      // await queryRunner.rollbackTransaction();

      throw new ConflictException(error.message);

    } finally {
      // Release the query runner
      // await queryRunner.release();
    }
  }

  async findAll(paginationOptions: PaginationDto): Promise<Pagination<User>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = await this.userRepository
        .createQueryBuilder('user')
        .orderBy('user.createdAt', 'DESC');

      return await this.paginationService.paginate<User>(queryBuilder, options);
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
        .where('user.id = :id', { id })
        .getOne();

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

  // async assignPermissionToUser(
  //   createUserPermissionDto: CreateUserPermissionDto,
  // ) {
  //   return await this.userPermissionService.assignPermissionToUser(
  //     createUserPermissionDto,
  //   );
  // }
  // async findPermissionsByUserId(id: string) {
  //   try {
  //     const user = await this.userRepository
  //       .createQueryBuilder('user')
  //       .leftJoinAndSelect('user.userPermissions', 'userPermission')
  //       .leftJoinAndSelect('userPermission.permission', 'permission')
  //       .where('user.id = :id', { id })
  //       .getOne();

  //     if (user) {
  //       const permissions = user.userPermissions
  //         .filter((userPermission) => userPermission.permission)
  //         .map((userPermission) => userPermission.permission);

  //       delete user.userPermissions;

  //       return {
  //         ...user,
  //         permissions: permissions,
  //       };
  //     } else {
  //       return null;
  //     }
  //   } catch (error) {
  //     if (error.name === 'EntityNotFoundError') {
  //       throw new NotFoundException(`User with id ${id} not found.`);
  //     }
  //     throw error;
  //   }
  // }

  // async deAttachOneUserPermissionByUserId(
  //   userId: string,
  //   permissionId: string,
  // ) {
  //   return await this.userPermissionService.deAttachOneUserPermissionByUserId(
  //     userId,
  //     permissionId,
  //   );
  // }
}
