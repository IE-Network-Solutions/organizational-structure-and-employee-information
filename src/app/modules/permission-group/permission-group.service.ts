import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import { PermissionGroup } from './entities/permission-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { PermissionService } from '../permission/permission.service';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import { checkIfDataExists } from '@root/src/core/utils/checkIfDataExists.util';
import { applySearchFilterUtils } from '@root/src/core/utils/search-filter.utils';
import { PermissionGroupRepository } from './permission-group-reposiory';
import { PermissionGroupInterface } from './permission-group-interface'; 

@Injectable()
export class PermissionGroupService implements PermissionGroupInterface {
  
  constructor(
    @InjectRepository(PermissionGroup)
    private readonly permissionGroupRepository: PermissionGroupRepository,
    private readonly paginationService: PaginationService,
    private readonly permissionService: PermissionService,
  ) {}
  async create(
    permissionGroupDto: CreatePermissionGroupDto,
  ): Promise<PermissionGroup> {
    const data = this.permissionGroupRepository.create(permissionGroupDto);
    const valuesToCheck = { name: data.name };
    try {
      await checkIfDataExists(valuesToCheck, this.permissionGroupRepository);
      const permissionGroups = await this.permissionGroupRepository.save(data);
      if (
        permissionGroupDto.permissions &&
        permissionGroupDto.permissions.length > 0
      ) {
        const updatePromises = permissionGroupDto.permissions.map(
          (permissionId) =>
            this.permissionService.update(permissionId, {
              permissionGroupId: permissionGroups.id,
            }),
        );
        await Promise.all(updatePromises);
      }
      return permissionGroups;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findAll(
    paginationOptions: PaginationDto,
    searchFilterDTO: SearchFilterDTO,
  ): Promise<Pagination<PermissionGroup>> {
    const options: IPaginationOptions = {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };
    try {
      const queryBuilder = this.permissionGroupRepository
        .createQueryBuilder('permissionGroup')
        .leftJoinAndSelect('permissionGroup.permission', 'permission');
      await applySearchFilterUtils(
        queryBuilder,
        searchFilterDTO,
        this.permissionGroupRepository,
      );
      return await this.paginationService.paginate<PermissionGroup>(
        queryBuilder,
        options,
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Permission group not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string): Promise<PermissionGroup> {
    try {
      const permissionGroup =
        await this.permissionGroupRepository.findOneOrFail({
          where: { id },
          relations: ['permission'],
        });
      return permissionGroup;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `Permission group with id ${id} not found.`,
        );
      }
      throw error;
    }
  }

  async update(
    id: string,
    updatePermissionGroupDto: UpdatePermissionGroupDto,
  ): Promise<PermissionGroup> {
    try {
      const existingPermissionGroup = await this.findOne(id);

      existingPermissionGroup.name = updatePermissionGroupDto.name;
      existingPermissionGroup.description =
        updatePermissionGroupDto.description;
      existingPermissionGroup.permission =
        await this.permissionService.findBulkPermissionsByPermissionId(
          updatePermissionGroupDto,
        );
      await this.permissionGroupRepository.save(existingPermissionGroup);
      return existingPermissionGroup;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `Permission group with id ${id} not found.`,
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.permissionGroupRepository.softDelete(id);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `Permission group with id ${id} not found.`,
        );
      }
      throw error;
    }
  }
}
