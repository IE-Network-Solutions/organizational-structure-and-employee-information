import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
// import { SeederModule } from '../permission-seeder/permission-seeder.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [PermissionService, PaginationService],
  exports: [PermissionService],
})
export class PermissionModule {}
