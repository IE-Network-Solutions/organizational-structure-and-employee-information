import { Module } from '@nestjs/common';
import { WorkSchedulesService } from './work-schedules.service';
import { WorkSchedulesController } from './work-schedules.controller';
import { WorkSchedule } from './entities/work-schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { Organization } from '../organizations/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkSchedule, Organization])],

  controllers: [WorkSchedulesController],
  providers: [WorkSchedulesService, PaginationService, OrganizationsService],
  exports:[WorkSchedulesService]
})
export class WorkSchedulesModule {}
