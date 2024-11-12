import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { RolePermissionService } from './role-permission.service';
import { RolePermission } from './entities/role-permission.entity';
import { RolePermissionRepository } from './role-permission-repository';
import { RolePermissionController } from './role-permission.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolePermission, RolePermissionRepository]),
  ],
  controllers: [RolePermissionController],
  providers: [RolePermissionService, PaginationService],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}
