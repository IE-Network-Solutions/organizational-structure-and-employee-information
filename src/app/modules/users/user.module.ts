import { EmployeeInformationModule } from './../employee-information/employee-information.module';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './user.controller';
import { FileUploadModule } from '@root/src/core/commonServices/upload.module';
import { EmployeeJobInformationModule } from '../employee-job-information/employee-job-information.module';
import { EmployeeInformationFormModule } from '../employee-information-form/employee-information-form.module';
import { NationalityModule } from '../nationality/nationality.module';
import { PermissionModule } from '../permission/permission.module';
import { PermissionGroupModule } from '../permission-group/permission-group.module';
import { RoleModule } from '../role/role.module';
import { EmployementTypeModule } from '../employment-type/employement-type.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
    EmployeeInformationModule,
    EmployeeJobInformationModule,
    EmployeeInformationFormModule,
    NationalityModule,
    PermissionModule,
    PermissionGroupModule,
    RoleModule,
    EmployementTypeModule,
    FileUploadModule
  ],
  controllers: [UsersController],
  providers: [UserService, PaginationService],
  exports: [UserService],
})
export class UserModule { }
