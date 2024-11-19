import {
  BadRequestException,
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
import * as permissionData from '../../../core/utils/permission.json';
import { UpdateResult } from 'typeorm';

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
    const newGroup = this.permissionGroupRepository.create({
      name: permissionGroupDto.name,
      description: permissionGroupDto.description,
    });

    try {
      await checkIfDataExists(
        { name: newGroup.name },
        this.permissionGroupRepository,
      );

      if (permissionGroupDto.permissions?.length) {
        const permissions = await Promise.all(
          permissionGroupDto.permissions.map((permissionId) =>
            this.permissionService.findOne(permissionId),
          ),
        );

        newGroup.permissions = permissions;
      }

      const savedGroup = await this.permissionGroupRepository.save(newGroup);
      return savedGroup;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async getOrCreate(
    permissionGroupDto: CreatePermissionGroupDto,
  ): Promise<PermissionGroup> {
    const existingGroup = await this.permissionGroupRepository.findOne({
      where: { name: permissionGroupDto.name },
    });
    return existingGroup || this.create(permissionGroupDto);
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
        .leftJoinAndSelect('permissionGroup.permissions', 'permissions');

      await applySearchFilterUtils(
        queryBuilder,
        searchFilterDTO,
        this.permissionGroupRepository,
      );

      return this.paginationService.paginate<PermissionGroup>(
        queryBuilder,
        options,
      );
    } catch (error) {
      throw new NotFoundException('Permission groups not found.');
    }
  }

  async findOne(id: string): Promise<PermissionGroup> {
    try {
      return await this.permissionGroupRepository.findOneOrFail({
        where: { id },
        relations: ['permissions'],
      });
    } catch (error) {
      throw new NotFoundException(`Permission group with ID ${id} not found.`);
    }
  }

  async update(
    id: string,
    updateDto: UpdatePermissionGroupDto,
  ): Promise<PermissionGroup> {
    const existingGroup = await this.findOne(id);
    Object.assign(existingGroup, updateDto);

    if (updateDto.permissions) {
      existingGroup.permissions =
        await this.permissionService.findBulkPermissionsByPermissionId(
          updateDto,
        );
    }

    return this.permissionGroupRepository.save(existingGroup);
  }

  async remove(id: string): Promise<UpdateResult> {
    const group = await this.findOne(id);

    return await this.permissionGroupRepository.softDelete(group.id);
  }

  async permissionSeeder() {
    try {
      const allGroupPermissions = await Promise.all(
        permissionData.map(async (data) => {
          const group = await this.getOrCreate({
            name: data.group,
            description: data.group,
          });
          const permissions = await Promise.all(
            data.permissions.map((perm) =>
              this.permissionService
                .create({
                  name: perm.name,
                  slug: perm.slug,
                  description: perm.slug,
                  permissionGroupId: group.id,
                })
                .catch(() => null),
            ),
          );
          return { group, permissions: permissions.filter(Boolean) };
        }),
      );

      return allGroupPermissions;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
