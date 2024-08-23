// import { RolePermissionService } from './../role-permission/role-permission.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import { applySearchFilterUtils } from '@root/src/core/utils/search-filter.utils';
import { checkIfDataExists } from '@root/src/core/utils/checkIfDataExists.util';
import { RolePermissionService } from '../role-permission/role-permission.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly paginationService: PaginationService, // private readonly rolePermissionService: RolePermissionService,
    private readonly rolePermissionService: RolePermissionService,
  ) { }

  async create(tenantId: string, createRoleDto: CreateRoleDto): Promise<Role> {
    const slug = createRoleDto.name.toLowerCase()              // Convert all letters to lowercase
      .replace(/\s+/g, '_');
    createRoleDto["slug"] = slug
    const data = this.roleRepository.create({ tenantId, ...createRoleDto });

    const valuesToCheck = { name: data.name };
    try {
      await checkIfDataExists(valuesToCheck, this.roleRepository);
      const role = await this.roleRepository.save(data);
      await this.rolePermissionService.createRoleWithPermissions(
        role.id,
        createRoleDto.permission,
      );
      return role;
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async findAll(
    paginationOptions: PaginationDto,
    searchFilterDTO: SearchFilterDTO,
    tenantId: string,
  ): Promise<Pagination<Role>> {
    const options: IPaginationOptions = {
      page: paginationOptions?.page,
      limit: paginationOptions?.limit,
    };

    try {
      const queryBuilder = this.roleRepository.createQueryBuilder('role');

      await applySearchFilterUtils(
        queryBuilder,
        searchFilterDTO,
        this.roleRepository,
      );

      const paginatedData = await this.paginationService.paginate<Role>(
        this.roleRepository,
        'role',
        options,
        paginationOptions.orderBy,
        paginationOptions.orderDirection,
        { tenantId },
      );
      return paginatedData;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Role not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.roleRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Role with id ${id} not found.`);
      }
      throw error;
    }
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
    tenantId: string,
  ): Promise<Role> {
    try {
      await this.findOne(id);
      await this.roleRepository.update(id, {
        name: updateRoleDto.name,
        description: updateRoleDto.description,
      });
      await this.rolePermissionService.updateRolePermissions(
        id,
        updateRoleDto['permission'],
        tenantId,
      );
      return await this.findOne(id);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Role with id ${id} not found.`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.roleRepository.softDelete(id);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Role with id ${id} not found.`);
      }
      throw error;
    }
  }

  async findAllRoleWithPermissions(paginationOptions: PaginationDto) {
    const options: IPaginationOptions = {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };
    try {
      const roles = await this.roleRepository.find();
      const rolePermissions = await this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
        .leftJoinAndSelect('rolePermissions.permissions', 'permissions')
        .getMany();

      const rolesWithPermissions = roles.map((role) => {
        const permissions = rolePermissions
          .filter((rolePermission) => rolePermission.id === role.id)
          .flatMap((rolePermission) =>
            rolePermission.rolePermissions.map(
              (rolePermission) => rolePermission.permissions,
            ),
          );
        return { ...role, permissions };
      });

      return rolesWithPermissions;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Role not found.`);
      }
      throw error;
    }
  }

  async findOneRoleWithPermissions(id: string) {
    try {
      const role = await this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.rolePermissions', 'rolePermission')
        .leftJoinAndSelect('rolePermission.permissions', 'permissions')
        .where('role.id = :id', { id })
        .getOne();

      if (role) {
        const permissions = role.rolePermissions.map(
          (rolePermission) => rolePermission.permissions,
        );
        delete role.rolePermissions;
        return {
          ...role,
          permissions,
        };
      } else {
        return null;
      }
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Role not found.`);
      }
      throw error;
    }
  }

  async deAttachPermissionsFromRole(roleId: string, permissionIds: string[]) {
    try {
      return await this.rolePermissionService.deAttachPermissionsFromRole(
        roleId,
        permissionIds,
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException('Role-Permission not found.');
      }
      throw error;
    }
  }



  async createFirstRole(createRoleDto: CreateRoleDto, tenantId) {
    const slug = createRoleDto.name.toLowerCase()              // Convert all letters to lowercase
      .replace(/\s+/g, '_');
    createRoleDto["slug"] = slug
    const createRole = await this.roleRepository.create({ tenantId, ...createRoleDto })
    return await this.roleRepository.save(createRole)
  }
}
