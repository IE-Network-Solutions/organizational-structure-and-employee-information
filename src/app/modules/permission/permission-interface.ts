import { Pagination } from 'nestjs-typeorm-paginate';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UpdateResult } from 'typeorm';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';

export interface PermissionInterface {
  create(createPermissionDto: CreatePermissionDto): Promise<Permission>;
  findAll(
    paginationOptions?: PaginationDto,
    searchFilterDTO?: SearchFilterDTO,
  ): Promise<Pagination<Permission>>;
  findOne(id: string): Promise<Permission>;
  update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission>;
  remove(id: string): Promise<UpdateResult>;
}
