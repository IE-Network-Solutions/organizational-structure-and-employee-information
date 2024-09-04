import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult } from 'typeorm';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';

export interface RoleInterface {
  create(tenantId: string, createRoleDto: CreateRoleDto): Promise<Role>;
  findAll(
    paginationOptions?: PaginationDto,
    searchFilterDTO?: SearchFilterDTO,
    tenantId?: string,
  ): Promise<Pagination<Role>>;
  findOne(id: string): Promise<Role>;
  update(
    id: string,
    updateRoleDto: UpdateRoleDto,
    tenantId: string,
  ): Promise<Role>;
  remove(id: string): Promise<UpdateResult>;
}
