import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { UserPermission } from './entities/user-permission.entity';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UserPermissionRepository } from './user-permission-repository';
import { UserPermissionInterface } from './user-permission-interface';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';

@Injectable()
export class UserPermissionService implements UserPermissionInterface {
  constructor(
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: UserPermissionRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async assignPermissionToUser(
    createUserPermissionDto: CreateUserPermissionDto,
    tenantId: string,
  ): Promise<any> {
    const assignedPermissions = createUserPermissionDto.permissionId.map(
      (permissionId) => {
        return this.userPermissionRepository.create({
          user: { id: createUserPermissionDto.userId },
          permission: { id: permissionId },
          tenantId: tenantId,
        });
      },
    );
    return await this.userPermissionRepository.save(assignedPermissions);
  }

  async findAll(
    paginationOptions: PaginationDto,
  ): Promise<Pagination<UserPermission>> {
    const options: IPaginationOptions = {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };
    try {
      const queryBuilder = this.userPermissionRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.permissions', 'permissions');

      return await this.paginationService.paginate<UserPermission>(
        queryBuilder,
        options,
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User-Permission not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string): Promise<UserPermission> {
    try {
      return await this.userPermissionRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User-Permission with id ${id} not found.`);
      }
      throw error;
    }
  }

  async update(
    id: string,
    updateUserPermissionDto: UpdateUserPermissionDto,
    tenantId: string,
  ): Promise<any> {
    try {
      await this.userPermissionRepository.delete({ user: { id: id } });
      const assignedPermissions = updateUserPermissionDto.permissionId.map(
        (permissionId) => {
          return this.userPermissionRepository.create({
            user: { id: id },

            permission: { id: permissionId },
            tenantId: tenantId,
          });
        },
      );
      return await this.userPermissionRepository.save(assignedPermissions);

      // const userPermission = await this.findOne(id);
      // Object.assign(userPermission, userPermissionDto);
      // await this.userPermissionRepository.save(userPermission);
      // return userPermission;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User-Permission with id ${id} not found.`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.userPermissionRepository.softDelete(id);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User-Permission with id ${id} not found.`);
      }
      throw error;
    }
  }

  async deAttachOneUserPermissionByUserId(
    userId: string,
    permissionId: string,
  ) {
    try {
      const userPermission = await this.userPermissionRepository.findOneOrFail({
        where: {
          user: { id: userId },
          permission: { id: permissionId },
        },
      });
      await this.userPermissionRepository.delete({ id: userPermission.id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User-Permission not found.`);
      }
      throw error;
    }
  }
}
