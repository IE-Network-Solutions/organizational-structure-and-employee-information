import { Pagination } from 'nestjs-typeorm-paginate';
import { PermissionGroup } from './entities/permission-group.entity';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import { UpdateResult } from 'typeorm';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';

export interface PermissionGroupInterface {
  create(
    createPermissionGroupDto: CreatePermissionGroupDto,
  ): Promise<PermissionGroup>;
  findAll(
    paginationOptions?: PaginationDto,
    searchFilterDTO?: SearchFilterDTO,
  ): Promise<Pagination<PermissionGroup>>;
  findOne(id: string): Promise<PermissionGroup>;
  update(
    id: string,
    updatePermissionGroupDto: UpdatePermissionGroupDto,
  ): Promise<PermissionGroup>;
  remove(id: string): Promise<UpdateResult>;
}
