import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { WorkSchedulesService } from './work-schedules.service';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule.dto';
import { ApiTags } from '@nestjs/swagger';
import { WorkSchedule } from './entities/work-schedule.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('work-schedules')
@ApiTags('Work-Schedules')
export class WorkSchedulesController {
  constructor(private readonly workSchedulesService: WorkSchedulesService) {}

  @Post()
  async createWorkSchedule(
    @Req() req: Request,
    @Body() createWorkScheduleDto: CreateWorkScheduleDto,
  ): Promise<WorkSchedule> {
    const tenantId = req['tenantId'];
    return await this.workSchedulesService.createWorkSchedule(
      createWorkScheduleDto,
      tenantId,
    );
  }

  @Get()
  async findAllWorkSchedule(
    @Req() req: Request,
    @Query()
    paginationOptions?: PaginationDto,
  ): Promise<Pagination<WorkSchedule>> {
    const tenantId = req['tenantId'];
    return await this.workSchedulesService.findAllWorkSchedules(
      paginationOptions,
      tenantId,
    );
  }

  @Get(':id')
  async findOneWorkSchedule(@Param('id') id: string): Promise<WorkSchedule> {
    return await this.workSchedulesService.findOneWorkSchedule(id);
  }

  @Patch(':id')
  async updateWorkSchedule(
    @Param('id') id: string,
    @Body() updateWorkScheduleDto: UpdateWorkScheduleDto,
  ): Promise<WorkSchedule> {
    return await this.workSchedulesService.updateWorkSchedule(
      id,
      updateWorkScheduleDto,
    );
  }

  @Delete(':id')
  async removeWorkSchedule(@Param('id') id: string): Promise<WorkSchedule> {
    return await this.workSchedulesService.removeWorkSchedule(id);
  }
}
