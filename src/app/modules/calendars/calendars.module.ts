import { Module } from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { CalendarsController } from './calendars.controller';
import { Calendar } from './entities/calendar.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { Organization } from '../organizations/entities/organization.entity';
import { CalendarSubscriber } from './subscribers/calendar.subscriber';
import { OrganizationsService } from '../organizations/organizations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar, Organization])],

  controllers: [CalendarsController],
  providers: [CalendarsService, PaginationService, OrganizationsService],
  exports:[CalendarsService]
})
export class CalendarsModule {}
