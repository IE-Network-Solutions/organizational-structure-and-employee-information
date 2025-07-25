import { Module, forwardRef, Inject } from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { CalendarsController } from './calendars.controller';
import { Calendar } from './entities/calendar.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { Organization } from '../organizations/entities/organization.entity';
import { CalendarSubscriber } from './subscribers/calendar.subscriber';
import { OrganizationsService } from '../organizations/organizations.service';
import { SessionModule } from '../session/session.module';
import { EmployeeJobInformationModule } from '../employee-job-information/employee-job-information.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Calendar, Organization]),
    SessionModule,
    forwardRef(() => EmployeeJobInformationModule), // Use forwardRef here
  ],
  controllers: [CalendarsController],
  providers: [CalendarsService, PaginationService, OrganizationsService],
  exports: [CalendarsService],
})
export class CalendarsModule {}
