import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
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
import { tenantId } from '../branchs/tests/branch.data';
import { UpdateSessionDto } from '../session/dto/update-session.dto';
import { Between } from 'typeorm';
import { EmployeeJobInformationService } from '../employee-job-information/employee-job-information.service';

@Injectable()
export class CalendarsService {
  constructor(
    @InjectRepository(Calendar)
    private calendarRepository: Repository<Calendar>,
    private paginationService: PaginationService,
    private organizationsService: OrganizationsService,
    private sessionService: SessionService,
    @Inject(forwardRef(() => EmployeeJobInformationService))
    private employeeJobInformationService: EmployeeJobInformationService,
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
      if (createCalendarDto.isActive && createCalendarDto.isActive === true) {
        const activeCalendar = await this.findActiveCalendar(tenantId);
        if (activeCalendar) {
          activeCalendar.isActive = false;
          await this.updateCalendar(
            activeCalendar.id,
            activeCalendar,
            tenantId,
            false,
          );
        }
      }
      // Check if there's already an active calendar

      const createCalendar = await this.calendarRepository.create({
        ...createCalendarDto,

        tenantId: tenantId,
      });
      const savedCalendar = await queryRunner.manager.save(
        Calendar,
        createCalendar,
      );

      if (createCalendarDto.sessions.length > 0) {
        await Promise.all(
          createCalendarDto.sessions.map(async (singleSession) => {
            const session = new CreateSessionDto();
            session.calendarId = savedCalendar.id;
            session.description = singleSession.description;
            session.endDate = singleSession.endDate;
            session.startDate = singleSession.startDate;
            session.name = singleSession.name;
            session.months = singleSession.months;
            session.active = singleSession.active || false;
            const createMonth = await this.sessionService.createSession(
              session,
              tenantId,
              queryRunner,
            );
          }),
        );
      }

      await queryRunner.commitTransaction();

      if (savedCalendar) {
        const organizationData = new CreateOrganizationDto();
        organizationData.calendarId = savedCalendar.id;
        await this.organizationsService.createOrganiztion(
          organizationData,
          tenantId,
        );
        return await this.findOneCalendar(savedCalendar.id);
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
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
    const queryBuilder = await this.calendarRepository
      .createQueryBuilder('Calendar')
      .leftJoinAndSelect('Calendar.sessions', 'sessions')
      .leftJoinAndSelect('sessions.months', 'months')
      .andWhere('Calendar.tenantId = :tenantId', { tenantId });

    const paginatedData = await this.paginationService.paginate<Calendar>(
      queryBuilder,
      options,
    );
    return paginatedData;
  }

  async findOneCalendar(id: string): Promise<Calendar> {
    try {
      return await this.calendarRepository.findOneOrFail({
        where: { id },
        relations: ['sessions', 'sessions.months'],
      });
    } catch (error) {
      throw new NotFoundException(`Calendar with Id ${id} not found`);
    }
  }

  async updateCalendar(
    id: string,
    updateCalendarDto: UpdateCalendarDto,
    tenantId: string,
    setSession?: boolean,
  ): Promise<Calendar> {
    try {
      const calendar = await this.findOneCalendar(id);
      if (!calendar) {
        throw new NotFoundException(`Calendar with Id ${id} not found`);
      }
      if (updateCalendarDto.sessions && updateCalendarDto.sessions.length > 0) {
        const session = updateCalendarDto.sessions;
        delete updateCalendarDto.sessions;
        await this.sessionService.updateBulkSession(
          session,
          tenantId,
          id,
          setSession,
        );
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
  async findActiveCalendar(tenantId: string): Promise<Calendar> {
    try {
      const activeCalendar = await this.calendarRepository.findOne({
        where: { isActive: true, tenantId: tenantId },
        relations: ['sessions', 'sessions.months'],
      });
      if (!activeCalendar) {
        return null;
      }

      return activeCalendar;
    } catch (error) {
      throw new NotFoundException(`There Is No Active Calendar.`);
    }
  }

  async findActiveCalendarForAllTenants(): Promise<Calendar[]> {
    try {
      const calendar = await this.calendarRepository.find({
        where: { isActive: true },
        relations: ['sessions', 'sessions.months'],
      });
      return calendar;
    } catch (error) {
      throw new NotFoundException(`There Is No Active Calendar.`);
    }
  }
}
