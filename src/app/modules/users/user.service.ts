import { DataSource, getConnection } from 'typeorm';
// import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import {
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
import { CreateBulkRequestDto } from '@root/src/app/modules/users/createBulkRequest.dto';
import { QueryRunner, Repository } from 'typeorm';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { FileUploadService } from '@root/src/core/commonServices/upload.service';
import { CreateUserPermissionDto } from '../user-permission/dto/create-user-permission.dto';
import { UserPermissionService } from '../user-permission/user-permission.service';
import { applySearchFilterUtils } from '@root/src/core/utils/search-filter.utils';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';

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
    private readonly userPermissionService: UserPermissionService
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

  async findAll(
    paginationOptions: PaginationDto,
    searchFilterDTO: SearchFilterDTO,
    tenantId: string
  ): Promise<Pagination<User>> {
    const options: IPaginationOptions = {
      page: paginationOptions?.page,
      limit: paginationOptions?.limit
    };

    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      await applySearchFilterUtils(
        queryBuilder,
        searchFilterDTO,
        this.userRepository,
      );

      const paginatedData = await this.paginationService.paginate<User>(
        this.userRepository,
        'user',
        options,
        paginationOptions.orderBy,
        paginationOptions.orderDirection,
        { tenantId },
      );

      return paginatedData

    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.employeeInformation', 'employeeInformation')
        .leftJoinAndSelect('user.employeeJobInformation', 'employeeJobInformation')
        .leftJoinAndSelect('user.employeeDocument', 'employeeDocument')
        .where('user.id = :id', { id })
        .getOne();
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
