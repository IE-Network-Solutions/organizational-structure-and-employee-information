import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { RolePermissionService } from './role-permission.service';
import { RolePermission } from './entities/role-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission])],
  controllers: [],
  providers: [RolePermissionService, PaginationService],
  exports: [RolePermissionService],
})
export class RolePermissionModule { }
