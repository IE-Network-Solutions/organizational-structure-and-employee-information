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
  Headers,
  Put,
} from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Calendar } from './entities/calendar.entity';
import { ExcludeAuthGuard } from '@root/src/core/guards/exclud.guard';

@Controller('calendars')
@ApiTags('Calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @Post()
  async createCalendar(
    @Headers('tenantId') tenantId: string,
    @Body() createCalendarDto: CreateCalendarDto,
  ): Promise<Calendar> {
    return await this.calendarsService.createCalendar(
      createCalendarDto,
      tenantId,
    );
  }

  @Get()
  async findAllCalendars(
    @Headers('tenantId') tenantId: string,
    @Query()
    paginationOptions?: PaginationDto,
  ): Promise<Pagination<Calendar>> {
    return await this.calendarsService.findAllCalendars(
      paginationOptions,
      tenantId,
    );
  }

  @Get(':id')
  async findOneCalendar(@Param('id') id: string): Promise<Calendar> {
    return await this.calendarsService.findOneCalendar(id);
  }

  @Put(':id')
  async updateCalendar(
    @Headers('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() updateCalendarDto: UpdateCalendarDto,
  ): Promise<Calendar> {
    return await this.calendarsService.updateCalendar(
      id,
      updateCalendarDto,
      tenantId,
    );
  }

  @Delete(':id')
  async removeCalendar(@Param('id') id: string): Promise<Calendar> {
    return await this.calendarsService.removeCalendar(id);
  }

  @Get('active/calendar')
  @ExcludeAuthGuard()
  async findActiveCalander(@Req() req: Request): Promise<Calendar> {
    const tenantId = req['tenantId'];
    return await this.calendarsService.findActiveCalendar(tenantId);
  }


}
