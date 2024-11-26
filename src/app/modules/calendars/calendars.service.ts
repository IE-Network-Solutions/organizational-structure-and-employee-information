import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { Calendar } from './entities/calendar.entity';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationsService } from '../organizations/organizations.service';
import { CreateOrganizationDto } from '../organizations/dto/create-organization.dto';
import { SessionService } from '../session/session.service';
import { CreateSessionDto } from '../session/dto/create-session.dto';

@Injectable()
export class CalendarsService {
  constructor(
    @InjectRepository(Calendar)
    private calendarRepository: Repository<Calendar>,
    private paginationService: PaginationService,
    private organizationsService: OrganizationsService,
    private sessionService : SessionService,

    private readonly connection: Connection,

  ) {}
  async createCalendar(
    createCalendarDto: CreateCalendarDto,
    tenantId: string,
  ): Promise<Calendar> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //const status = true;
      const calendar = await this.findActiveCalander(tenantId);
      if (calendar) {
        this.calendarRepository.update(calendar.id, { isActive: false });
      }
      const createCalendar = await this.calendarRepository.create({
        ...createCalendarDto,
        isActive: true,
        tenantId: tenantId,
      });
      const savedCalendar = await queryRunner.manager.save(
        Calendar,
        createCalendar,
      );
      for(const singleSession of createCalendarDto.sessions){
        const session = new CreateSessionDto()
        session.calendarId=savedCalendar.id
        session.description=singleSession.description
        session.endDate=singleSession.endDate
        session.startDate=singleSession.startDate
        session.name=singleSession.name
        session.months=singleSession.months
        const createMonth= this.sessionService.createSession(session,tenantId,queryRunner)
      }
   
      const organizationData = new CreateOrganizationDto();
      organizationData.calendarId = savedCalendar.id;
      await this.organizationsService.createOrganiztion(
        organizationData,
        tenantId,
        queryRunner
      );
      await queryRunner.commitTransaction();
      return savedCalendar;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    }
    finally {
      await queryRunner.release();
    }
  }

  async findAllCalendars(
    paginationOptions: PaginationDto,
    tenantId: string,
  ): Promise<Pagination<Calendar>> {
    const options: IPaginationOptions = {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };

    const paginatedData = await this.paginationService.paginate<Calendar>(
      this.calendarRepository,
      'p',
      options,
      paginationOptions.orderBy,
      paginationOptions.orderDirection,
      { tenantId },
    );

    return paginatedData;
  }

  async findOneCalendar(id: string): Promise<Calendar> {
    try {
      const calendar = await this.calendarRepository.findOneByOrFail({ id });
      return calendar;
    } catch (error) {
      throw new NotFoundException(`Calendar with Id ${id} not found`);
    }
  }

  async updateCalendar(
    id: string,
    updateCalendarDto: UpdateCalendarDto,
  ): Promise<Calendar> {
    try {
      const Calendar = await this.findOneCalendar(id);
      if (!Calendar) {
        throw new NotFoundException(`Calendar with Id ${id} not found`);
      }

      const updatedCalendar = await this.calendarRepository.update(
        id,
        updateCalendarDto,
      );
      return await this.findOneCalendar(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async removeCalendar(id: string): Promise<Calendar> {
    const Calendar = await this.findOneCalendar(id);
    if (!Calendar) {
      throw new NotFoundException(`calendar with Id ${id} not found`);
    }
    await this.calendarRepository.softRemove({ id });
    return Calendar;
  }
  async findActiveCalander(tenantId: string): Promise<Calendar> {
    try {
      const calendar = await this.calendarRepository.findOne({
        where: { isActive: true, tenantId: tenantId },
      });
      return calendar;
    } catch (error) {
      throw new NotFoundException(`There Is No Active Calendar.`);
    }
  }
  async findActiveCalendarForAllTenants(): Promise<Calendar[]> {
    try {

      const calendar = await this.calendarRepository.find({
        where: { isActive: true},
        relations:['sessions','sessions.months']
      });
      console.log()
      return calendar;
    } catch (error) {
      throw new NotFoundException(`There Is No Active Calendar.`);
    }
  }
}
