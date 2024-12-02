import { Module } from '@nestjs/common';
import { CronJobLogService } from './cron-job-log.service';
import { CronJobLogController } from './cron-job-log.controller';
import { CronJobLog } from './entities/cron-job-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationModule } from '@root/src/core/pagination/pagination.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CalendarsModule } from '../calendars/calendars.module';
import { MonthModule } from '../month/month.module';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CronJobLog]),
    PaginationModule,
    ScheduleModule.forRoot(),
    CalendarsModule,
    MonthModule,
    SessionModule,
  ],

  controllers: [CronJobLogController],
  providers: [CronJobLogService],
})
export class CronJobLogModule {}
