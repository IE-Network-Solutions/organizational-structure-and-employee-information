import { PermissionModule } from './../permission/permission.module';
import { Module } from '@nestjs/common';
import { PermissionGroupService } from './permission-group.service';
import { PermissionGroupController } from './permission-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGroup } from './entities/permission-group.entity';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { PermissionGroupRepository } from './permission-group-reposiory';
import { RoleModule } from '../role/role.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionGroup, PermissionGroupRepository]),
    PermissionModule,
    RoleModule,
    RolePermissionModule,
  ],

  controllers: [PermissionGroupController],
  providers: [PermissionGroupService, PaginationService],
  exports: [PermissionGroupService],
})
export class PermissionGroupModule {}
