import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Put,
  Query,
} from '@nestjs/common';
import { CronJobLogService } from './cron-job-log.service';
import { CreateCronJobLogDto } from './dto/create-cron-job-log.dto';
import { UpdateCronJobLogDto } from './dto/update-cron-job-log.dto';
import { CronJobLog } from './entities/cron-job-log.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('cron-job-log')
@ApiTags('month')
export class CronJobLogController {
  constructor(private readonly cronJobLogService: CronJobLogService) {}

  @Post()
  async createCronJobLog(
    @Body() createCronJobLogDto: CreateCronJobLogDto,
    @Headers('tenantId') tenantId: string,
  ): Promise<CronJobLog> {
    return await this.cronJobLogService.createCronJobLog(
      createCronJobLogDto,
      tenantId,
    );
  }
  @Get('')
  async findAllCronJobLogs(
    @Headers('tenantId') tenantId: string,
    @Query() paginationOptions?: PaginationDto,
  ) {
    return this.cronJobLogService.findAllCronJobLogs(
      tenantId,
      paginationOptions,
    );
  }

  @Get(':id')
  findOneCronJobLog(@Param('id') id: string) {
    return this.cronJobLogService.findOneCronJobLog(id);
  }

  @Put(':id')
  updateCronJobLog(
    @Headers('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() updateCronJobLogDto: UpdateCronJobLogDto,
  ) {
    return this.cronJobLogService.updateCronJobLog(
      id,
      updateCronJobLogDto,
      tenantId,
    );
  }

  @Delete(':id')
  removeCronJobLog(
    @Headers('tenantId') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.cronJobLogService.removeCronJobLog(id);
  }
}
