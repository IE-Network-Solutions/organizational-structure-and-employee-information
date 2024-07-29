import { Global, Module } from '@nestjs/common';
import { PermissionModule } from './modules/permission/permission.module';
import { PermissionGroupModule } from './modules/permission-group/permission-group.module';
import { RoleModule } from './modules/role/role.module';
import { UsersModule } from './modules/users/user.module';
import { EmployeeInformationModule } from './modules/employee-information/employee-information.module';
import { EmployeeJobInformationModule } from './modules/employee-job-information/employee-job-information.module';
import { EmployeeTypeModule } from './modules/employment-type/employee-type.module';
import { NationalityModule } from './modules/nationality/nationality.module';
import { RolePermissionModule } from './modules/role-permission/role-permission.module';
import { UserPermissionModule } from './modules/user-permission/user-permission.module';

@Global()
@Module({
  imports: [PermissionModule, PermissionGroupModule, RoleModule, UsersModule, EmployeeInformationModule, EmployeeJobInformationModule, EmployeeTypeModule, NationalityModule, RolePermissionModule, UserPermissionModule],
})
export class CoreModule { }
