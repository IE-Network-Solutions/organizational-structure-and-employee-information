import { RoleService } from './role.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { Role } from './entities/role.entity';
import { RoleController } from './role.controller';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleRepository } from './role-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RoleRepository]),
    RolePermissionModule,
  ],
  controllers: [RoleController],
  providers: [RoleService, PaginationService],
  exports: [RoleService],
})
export class RoleModule {}
