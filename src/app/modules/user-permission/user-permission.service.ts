import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { UserPermission } from './entities/user-permission.entity';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-user-permission.dto';

@Injectable()
export class UserPermissionService {
  constructor(
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
    private readonly paginationService: PaginationService,
  ) {}

  async assignPermissionToUser(
    createUserPermissionDto: CreateUserPermissionDto,
    tenantId: string,
  ) {
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
    userPermissionDto: UpdateRolePermissionDto,
  ): Promise<UserPermission> {
    try {
      const userPermission = await this.findOne(id);
      Object.assign(userPermission, userPermissionDto);
      await this.userPermissionRepository.save(userPermission);
      return userPermission;
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
      // const userPermission = await this.userPermissionRepository.findOneOrFail({
      //   where: {
      //     user: { id: userId },
      //     permission: { id: permissionId },
      //   },
      // });
      // await this.userPermissionRepository.delete({ id: userPermission.id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User-Permission not found.`);
      }
      throw error;
    }
  }
}
