import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { RolePermission } from './entities/role-permission.entity';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    private readonly paginationService: PaginationService,
  ) { }
  async createRoleWithPermissions(roleId: string, permissionIds: string[]) {
    const assignedPermissions = permissionIds.map((permissionId) => {
      return this.rolePermissionRepository.create({
        role: { id: roleId },
        permissions: { id: permissionId },
      });
    });
    return await this.rolePermissionRepository.save(assignedPermissions);
  }

  async findAll(
    paginationOptions: PaginationDto,
  ): Promise<Pagination<RolePermission>> {
    const options: IPaginationOptions = {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };
    try {
      const queryBuilder = this.rolePermissionRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.permissions', 'permissions');

      return await this.paginationService.paginate<RolePermission>(
        queryBuilder,
        options,
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Role-Permission not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string): Promise<RolePermission> {
    try {
      return await this.rolePermissionRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Role-Permission with id ${id} not found.`);
      }
      throw error;
    }
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    try {
      await this.rolePermissionRepository.delete({ role: { id: roleId } });
      const assignedPermissions = permissionIds.map((permissionId) => {
        return this.rolePermissionRepository.create({
          role: { id: roleId },
          permissions: { id: permissionId },
        });
      });
      return await this.rolePermissionRepository.save(assignedPermissions);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Role-Permission not found.`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.rolePermissionRepository.softDelete(id);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Role-Permission with id ${id} not found.`);
      }
      throw error;
    }
  }

  async deAttachPermissionsFromRole(roleId: string, permissionIds: string[]) {
    try {
      const rolePermissions = await this.rolePermissionRepository.find({
        where: {
          role: { id: roleId },
          permissions: { id: In(permissionIds) },
        },
      });
      return await this.rolePermissionRepository.remove(rolePermissions);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException('Role-Permission not found.');
      }
      throw error;
    }
  }
}
