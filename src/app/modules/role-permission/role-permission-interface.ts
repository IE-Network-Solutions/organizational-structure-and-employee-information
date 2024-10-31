import { RolePermission } from './entities/role-permission.entity';
import { PaginationDto } from './../../../core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult } from 'typeorm';

export interface RolePermissionInterface {
  createRoleWithPermissions(
    roleId: string,
    permissionIds: string[],
    tenantId:string
  ): Promise<RolePermission[]>;
  findAll(
    paginationOptions?: PaginationDto,
  ): Promise<Pagination<RolePermission>>;
  findOne(id: string): Promise<RolePermission>;
  updateRolePermissions(
    roleId: string,
    permissionIds: string[],
    tenantId: string,
  ): Promise<RolePermission>;
  remove(id: string): Promise<UpdateResult>;
}
