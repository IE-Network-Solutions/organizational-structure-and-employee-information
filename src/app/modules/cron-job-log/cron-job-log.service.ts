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
import { UpdateSessionDto } from '../session/dto/update-session.dto';
import { UpdateMonthDto } from '../month/dto/update-month.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MonthService } from '../month/month.service';
import { SessionService } from '../session/session.service';
import { ExecutionStatus } from './enum/execution-status.enum';

@Injectable()
export class CronJobLogService {
  private readonly logger = new Logger(CronJobLogService.name);

  constructor(
    @InjectRepository(CronJobLog)
    private cronJobLogRepository: Repository<CronJobLog>,
    private readonly paginationService: PaginationService,
    private readonly calendarsService: CalendarsService,
    private readonly monthService: MonthService,
    private readonly sessionService: SessionService, //private schedulerRegistry: SchedulerRegistry)
  ) {}
  @Cron('0 0 * * *')
  async cronJob() {
    let tenantId: string;
    try {
      const today = new Date();
      const activeCalendars =
        await this.calendarsService.findActiveCalendarForAllTenants();

      for (const activeCalendar of activeCalendars) {
        const startDate = new Date(activeCalendar.startDate);
        const endDate = new Date(activeCalendar.endDate);
        tenantId = activeCalendar.tenantId;
        if (today >= startDate && today <= endDate) {
          for (const session of activeCalendar.sessions) {
            const sessionStartDate = new Date(session.startDate);
            const sessionEndDate = new Date(session.endDate);
            if (today >= sessionStartDate && today <= sessionEndDate) {
              if (!session.active) {
                await this.sessionService.activateSession(
                  session.id,
                  session.tenantId,
                );
              }

              for (const month of session.months) {
                const monthStartDate = new Date(month.startDate);
                const monthEndDate = new Date(month.endDate);
                if (today >= monthStartDate && today <= monthEndDate) {
                  if (!month.active) {
                    await this.monthService.activateMonth(
                      month.id,
                      month.tenantId,
                    );
                  }
                }
              }
            }
          }
        }
      }

      const createCronJobLogDto = new CreateCronJobLogDto();
      createCronJobLogDto.status = ExecutionStatus.SUCCESS;
      createCronJobLogDto.executionDate = today;

      await this.createCronJobLog(createCronJobLogDto, tenantId);
    } catch (error) {
      const createCronJobLogDto = new CreateCronJobLogDto();

      const today = new Date();
      createCronJobLogDto.status = ExecutionStatus.FAILED;
      createCronJobLogDto.executionDate = today;

      await this.createCronJobLog(createCronJobLogDto, tenantId);
    }
  }

  async createCronJobLog(
    createCronJobLogDto: CreateCronJobLogDto,
    tenantId: string,
  ) {
    try {
      const cronJobLog = await this.cronJobLogRepository.create({
        ...createCronJobLogDto,
        tenantId,
      });
      return await this.cronJobLogRepository.save(cronJobLog);
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
