import { Global, Module } from '@nestjs/common';
import { OrganizationsModule } from './modules/organizations/organizations.module';

import { WorkSchedulesModule } from './modules/work-schedules/work-schedules.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { BranchesModule } from './modules/branchs/branches.module';
import { CalendarsModule } from './modules/calendars/calendars.module';
import { UserModule } from './modules/users/user.module';
import { EmployeeInformationModule } from './modules/employee-information/employee-information.module';
import { EmployeeDocumentModule } from './modules/employee-documents/employee-document.module';
import { PermissionModule } from './modules/permission/permission.module';
import { PermissionGroupModule } from './modules/permission-group/permission-group.module';
import { RoleModule } from './modules/role/role.module';
import { EmployeeInformationFormModule } from './modules/employee-information-form/employee-information-form.module';
import { EmployeeJobInformationModule } from './modules/employee-job-information/employee-job-information.module';
import { NationalityModule } from './modules/nationality/nationality.module';
import { RolePermissionModule } from './modules/role-permission/role-permission.module';
import { UserPermissionModule } from './modules/user-permission/user-permission.module';
import { EmployementTypeModule } from './modules/employment-type/employement-type.module';
import { EmployeeTerminationModule } from './modules/employee-termination/employee-termination.module';
import { OffboardingEmployeeTaskModule } from './modules/offboarding-employee-task/offboarding-employee-tasks.module';
import { OffboardingTasksTemplateModule } from './modules/offboarding-tasks-template/offboarding-tasks-template.module';
@Global()
@Module({
  imports: [
    UserModule,
    EmployeeInformationModule,
    EmployeeDocumentModule,
    PermissionModule,
    PermissionGroupModule,
    RoleModule,
    EmployeeInformationFormModule,
    EmployeeJobInformationModule,
    NationalityModule,
    RolePermissionModule,
    UserPermissionModule,
    EmployementTypeModule,

    OrganizationsModule,
    WorkSchedulesModule,
    CalendarsModule,
    DepartmentsModule,
    BranchesModule,
    OffboardingEmployeeTaskModule,
    OffboardingTasksTemplateModule,
    EmployeeTerminationModule,
  ],
})
export class CoreModule { }
