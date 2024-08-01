import { Global, Module } from '@nestjs/common';
import { PermissionModule } from './modules/permission/permission.module';
import { PermissionGroupModule } from './modules/permission-group/permission-group.module';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/users/user.module';
import { EmployeeInformationModule } from './modules/employee-information/employee-information.module';
import { EmployeeJobInformationModule } from './modules/employee-job-information/employee-job-information.module';
import { NationalityModule } from './modules/nationality/nationality.module';
import { RolePermissionModule } from './modules/role-permission/role-permission.module';
import { UserPermissionModule } from './modules/user-permission/user-permission.module';
import { EmployementTypeModule } from './modules/employment-type/employement-type.module';
import { EmployeeDocumentModule } from './modules/employee-documents/employee-document.module';

@Global()
@Module({
  imports: [
    UserModule,
    PermissionModule,
    PermissionGroupModule,
    RoleModule,
    EmployeeInformationModule,
    EmployeeJobInformationModule,
    EmployementTypeModule,
    NationalityModule,
    RolePermissionModule,
    UserPermissionModule,
    EmployeeDocumentModule],
})
export class CoreModule { }
