import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { RolePermissionService } from './role-permission.service';
import { RolePermission } from './entities/role-permission.entity';
import { RolePermissionRepository } from './role-permission-repository';
import { RolePermissionController } from './role-permission.controller';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolePermission, RolePermissionRepository]),
    PermissionModule,
  ],
  controllers: [RolePermissionController],
  providers: [RolePermissionService, PaginationService],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}
