import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionRepository } from './permission-repository';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { Permission } from './entities/permission.entity';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import { applySearchFilterUtils } from '@root/src/core/utils/search-filter.utils';
import { checkIfDataExists } from '@root/src/core/utils/checkIfDataExists.util';
import { UpdatePermissionGroupDto } from '../permission-group/dto/update-permission-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionInterface } from './permission-interface';
import { In } from 'typeorm';
import { tenantId } from '../branchs/tests/branch.data';

@Injectable()
export class PermissionService implements PermissionInterface {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: PermissionRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      const permission = this.permissionRepository.create(createPermissionDto);
      const valuesToCheck = { slug: createPermissionDto.slug };

      await checkIfDataExists(valuesToCheck, this.permissionRepository);

      return await this.permissionRepository.save(permission);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
  async findValidPermissions(permissionIds: string[]): Promise<Permission[]> {
    if (!permissionIds || permissionIds.length === 0) {
      return [];
    }

    const validPermissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });
    return validPermissions;
  }

  async findAll(
    paginationOptions: PaginationDto,
    searchFilterDTO: SearchFilterDTO,
  ): Promise<Pagination<Permission>> {
    const options: IPaginationOptions = {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };

    const queryBuilder = await this.permissionRepository.createQueryBuilder(
      'permission',
    );

    if (searchFilterDTO.columnName === 'name') {
      searchFilterDTO.query = searchFilterDTO.query.toLowerCase();
    }

    if (searchFilterDTO.columnName === 'permissionGroupId') {
      queryBuilder.innerJoin('permission.permissionGroups', 'permissionGroup');
      queryBuilder.andWhere('permissionGroup.id = :query', {
        query: searchFilterDTO.query,
      });
    } else {
      await applySearchFilterUtils(
        queryBuilder,
        searchFilterDTO,
        this.permissionRepository,
      );
    }

    return await this.paginationService.paginate<Permission>(
      queryBuilder,
      options,
    );
  }

  async findOne(id: string): Promise<Permission> {
    try {
      return await this.permissionRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Permission with id ${id} not found.`);
      }
      throw error;
    }
  }

  async findAllPermission(): Promise<Permission[]> {
    try {
      return await this.permissionRepository.find();
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Permission not found.`);
      }
      throw error;
    }
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    try {
      await this.findOne(id);
      await this.permissionRepository.update({ id }, updatePermissionDto);
      return await this.findOne(id);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Permission with id ${id} not found.`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.permissionRepository.softDelete(id);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Permission with id ${id} not found.`);
      }
      throw error;
    }
  }
  async findBulkPermissionsByPermissionId(
    updatePermissionGroupDto: UpdatePermissionGroupDto,
  ) {
    try {
      return await this.permissionRepository.findByIds(
        updatePermissionGroupDto.permissions,
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Permission not found.`);
      }
      throw error;
    }
  }
  async findPermissionBySlug(slug: string, tenantId: string) {
    try {
      return await this.permissionRepository.findOneOrFail({
        where: { slug: slug },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
