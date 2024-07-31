import { Global, Module } from '@nestjs/common';
import { OrganizationsModule } from './modules/organizations/organizations.module';

import { WorkSchedulesModule } from './modules/work-schedules/work-schedules.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { BranchesModule } from './modules/branchs/branches.module';
import { CalendarsModule } from './modules/calendars/calendars.module';
@Global()
@Module({
  imports: [
    OrganizationsModule,
    WorkSchedulesModule,
    CalendarsModule,
    DepartmentsModule,
    BranchesModule,
  ],
})
export class CoreModule {}
