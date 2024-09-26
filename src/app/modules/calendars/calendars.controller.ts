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
import { CalendarsService } from './calendars.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Calendar } from './entities/calendar.entity';

@Controller('calendars')
@ApiTags('Calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) { }

  @Post()
  async createCalendar(
    @Req() req: Request,
    @Body() createCalendarDto: CreateCalendarDto,
  ): Promise<Calendar> {
    const tenantId = req['tenantId'];
    return await this.calendarsService.createCalendar(
      createCalendarDto,
      tenantId,
    );
  }

  @Get()
  async findAllCalendars(
    @Req() req: Request,
    @Query()
    paginationOptions?: PaginationDto,
  ): Promise<Pagination<Calendar>> {
    const tenantId = req['tenantId'];
    return await this.calendarsService.findAllCalendars(
      paginationOptions,
      tenantId,
    );
  }

  @Get(':id')
  async findOneCalendar(@Param('id') id: string): Promise<Calendar> {
    return await this.calendarsService.findOneCalendar(id);
  }

  @Patch(':id')
  async updateCalendar(
    @Param('id') id: string,
    @Body() updateCalendarDto: UpdateCalendarDto,
  ): Promise<Calendar> {
    return await this.calendarsService.updateCalendar(id, updateCalendarDto);
  }

  @Delete(':id')
  async removeCalendar(@Param('id') id: string): Promise<Calendar> {
    return await this.calendarsService.removeCalendar(id);
  }

  @Get('/active')
  async findActiveCalander(@Req() req: Request): Promise<Calendar> {
    const tenantId = req['tenantId'];
    return await this.calendarsService.findActiveCalander(tenantId);
  }
}
