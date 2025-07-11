import { forwardRef, Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { Department } from './entities/department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { UserModule } from '../users/user.module';
import { EmployeeJobInformationModule } from '../employee-job-information/employee-job-information.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department, User]),
    forwardRef(() => UserModule),
    EmployeeJobInformationModule,
  ],

  controllers: [DepartmentsController],
  providers: [DepartmentsService, PaginationService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
