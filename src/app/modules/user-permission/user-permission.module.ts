import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { UserPermissionService } from './user-permission.service';
import { UserPermission } from './entities/user-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPermission])],
  controllers: [],
  providers: [UserPermissionService, PaginationService],
  exports: [UserPermissionService],
})
export class UserPermissionModule {}
