import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionRepository } from './permission-repository';
import { PaginationService } from '@root/src/core/pagination/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, PermissionRepository])],
  controllers: [PermissionController],
  providers: [PermissionService, PaginationService],
  exports: [PermissionService],
})
export class PermissionModule {}
