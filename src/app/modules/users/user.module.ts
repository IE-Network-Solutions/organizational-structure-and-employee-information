import { EmployeeInformationModule } from './../employee-information/employee-information.module';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { FileUploadModule } from '@root/src/core/upload/upload.module';
import { EmployeeJobInformationModule } from '../employee-job-information/employee-job-information.module';
import { EmployeeInformationFormModule } from '../employee-information-form/employee-information-form.module';
import { NationalityModule } from '../nationality/nationality.module';
import { PermissionModule } from '../permission/permission.module';
import { PermissionGroupModule } from '../permission-group/permission-group.module';
import { RoleModule } from '../role/role.module';
import { EmployementTypeModule } from '../employment-type/employement-type.module';
import { EmployeeDocumentModule } from '../employee-documents/employee-document.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { UserPermissionModule } from '../user-permission/user-permission.module';
import { DepartmentsModule } from '../departments/departments.module';
import { HttpModule } from '@nestjs/axios';
import { UserDepartmentService } from './services/user-relation-with-department.service';
import { JobPositionModule } from '../job-position/job-position.module';
import { BranchesModule } from '../branchs/branches.module';
import { WorkSchedulesModule } from '../work-schedules/work-schedules.module';
import { PaginationModule } from '@root/src/core/pagination/pagination.module';
import { DepartmentsService } from '../departments/departments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EmployeeInformationModule,
    EmployeeJobInformationModule,
    EmployeeInformationFormModule,
    NationalityModule,
    PermissionModule,
    PermissionGroupModule,
    RoleModule,
    EmployementTypeModule,
    FileUploadModule,
    EmployeeDocumentModule,
    RolePermissionModule,
    UserPermissionModule,
    JobPositionModule,
    WorkSchedulesModule,
    PaginationModule,
    BranchesModule,
    HttpModule.register({}),
    forwardRef(() => DepartmentsModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserDepartmentService],
  exports: [UserService],
})
export class UserModule {}
