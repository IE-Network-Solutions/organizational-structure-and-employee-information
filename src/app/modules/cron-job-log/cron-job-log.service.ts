import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCronJobLogDto } from './dto/create-cron-job-log.dto';
import { UpdateCronJobLogDto } from './dto/update-cron-job-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJobLog } from './entities/cron-job-log.entity';
import { Between, Repository } from 'typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
// import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CalendarsService } from '../calendars/calendars.service';

@Injectable()
export class CronJobLogService {
  private readonly logger = new Logger(CronJobLogService.name);

  constructor(
    @InjectRepository(CronJobLog)
    private cronJobLogRepository: Repository<CronJobLog>,
    private readonly paginationService: PaginationService,
    private readonly calendarsService: CalendarsService,
  ) //private schedulerRegistry: SchedulerRegistry)
  {}
  // @Cron(CronExpression.EVERY_30_SECONDS)
  async createCronJobLog(
    createCronJobLogDto: CreateCronJobLogDto,
    tenantId: string,
  ): Promise<any> {
    try {
      const today = new Date(); // Get the current date
      const activeCalendars =
        await this.calendarsService.findActiveCalendarForAllTenants();

      for (const activeCalendar of activeCalendars) {
        const startDate = new Date(activeCalendar.startDate);
        const endDate = new Date(activeCalendar.endDate);

        if (today >= startDate && today <= endDate) {
          for (const session of activeCalendar.sessions) {
            const sessionStartDate = new Date(session.startDate);
            const sessionEndDate = new Date(session.endDate);
            if (today >= sessionStartDate && today <= sessionEndDate) {
              if (session.active) {
                console.log(
                  `Today is within the active calendar period for tenant ${activeCalendar.tenantId}`,
                );
              } else {
                console.log('activate session');
                console.log('deactivate old session');
              }
              for (const month of session.months) {
                const monthStartDate = new Date(month.startDate);
                const monthEndDate = new Date(month.endDate);
                if (today >= monthStartDate && today <= monthEndDate) {
                  if (month.active) {
                    console.log(
                      `Today is within the active calendar period for tenant ${activeCalendar.tenantId}`,
                    );
                  } else {
                    console.log('activate month');
                    console.log('deactivate old month');
                  }
                } else {
                  console.log('calendar outdated1');
                }
              }
            } else {
              console.log('calendar outdated2');
            }
          }
          // Perform your logic for active calendars
        } else {
          console.log('calendar outdated3');
        }
      }
      //   const cronJobLog = await this.cronJobLogRepository.create({
      //     ...createCronJobLogDto,
      //     tenantId,
      //   });
      //  return await this.cronJobLogRepository.save(
      //   cronJobLog
      //   );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllCronJobLogs(
    tenantId: string,
    paginationOptions?: PaginationDto,
  ): Promise<Pagination<CronJobLog>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = this.cronJobLogRepository
        .createQueryBuilder('CronJobLog')
        .where('CronJobLog.tenantId = :tenantId', { tenantId });

      const paginatedData = await this.paginationService.paginate<CronJobLog>(
        queryBuilder,
        options,
      );

      return paginatedData;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneCronJobLog(id: string): Promise<CronJobLog> {
    try {
      const cronJobLog = await this.cronJobLogRepository.findOne({
        where: { id: id },
      });
      return cronJobLog;
    } catch (error) {
      throw new NotFoundException(`CronJobLog Not Found`);
    }
  }

  async updateCronJobLog(
    id: string,
    updateCronJobLogDto: UpdateCronJobLogDto,
    tenantId: string,
  ): Promise<CronJobLog> {
    try {
      const cronJobLog = await this.findOneCronJobLog(id);
      if (!cronJobLog) {
        throw new NotFoundException(`CronJobLog Not Found`);
      }
      await this.cronJobLogRepository.update({ id }, updateCronJobLogDto);
      return await this.findOneCronJobLog(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async removeCronJobLog(id: string): Promise<CronJobLog> {
    try {
      const cronJobLog = await this.findOneCronJobLog(id);
      if (!cronJobLog) {
        throw new NotFoundException(`CronJobLog Not Found`);
      }
      await this.cronJobLogRepository.softRemove({ id });
      return cronJobLog;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
