import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { MonthService } from '../month/month.service';
import { CreateMonthDto } from '../month/dto/create-month.dto';
import { create } from 'domain';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,

    private readonly paginationService: PaginationService,
    private readonly monthService: MonthService,
  ) {}
  async createSession(
    createSessionDto: CreateSessionDto,
    tenantId: string,
    queryRunner?: QueryRunner,
  ): Promise<Session> {
    try {
      const todaysDay = new Date();
      const startDate = new Date(createSessionDto.startDate);
      const endDate = new Date(createSessionDto.endDate);

      if (
        todaysDay.toISOString().split('T')[0] >=
          startDate.toISOString().split('T')[0] &&
        todaysDay.toISOString().split('T')[0] <=
          endDate.toISOString().split('T')[0]
      ) {
        createSessionDto.active = true;
      }
      const createdSession = queryRunner
        ? queryRunner.manager.create(Session, {
            ...createSessionDto,
            tenantId,
          })
        : this.sessionRepository.create({
            ...createSessionDto,
            tenantId,
          });
      const savedSession = queryRunner
        ? await queryRunner.manager.save(Session, createdSession)
        : await this.sessionRepository.save(createdSession);
      if (createSessionDto.months.length > 0) {
        await Promise.all(
          createSessionDto.months.map(async (month) => {
            const eachMonth = new CreateMonthDto();
            eachMonth.description = month.description;
            eachMonth.endDate = month.endDate;
            eachMonth.startDate = month.startDate;
            eachMonth.sessionId = savedSession.id;
            eachMonth.name = month.name;

            const savedMonth = await this.monthService.createMonth(
              eachMonth,
              tenantId,
              queryRunner,
            );
          }),
        );
      }

      return savedSession;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async findAllSessions(
    tenantId: string,
    paginationOptions?: PaginationDto,
  ): Promise<Pagination<Session>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = this.sessionRepository
        .createQueryBuilder('Session')
        .leftJoinAndSelect('Session.months','months')
        .where('Session.tenantId = :tenantId', { tenantId });

      const paginatedData = await this.paginationService.paginate<Session>(
        queryBuilder,
        options,
      );

      return paginatedData;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneSession(id: string): Promise<Session> {
    try {
      const session = await this.sessionRepository.findOne({
        where: { id: id },
      });
      return session;
    } catch (error) {
      throw new NotFoundException(`Session Not Found`);
    }
  }
  async updateBulkSession(
    updateSessionDto: UpdateSessionDto[],
    tenantId: string,
  ): Promise<Session[]> {
    try {
      const session = await Promise.all(
        updateSessionDto.map(
          async (item) => await this.updateSession(item.id, item, tenantId),
        ),
      );

      return session;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async updateSession(
    id: string,
    updateSessionDto: UpdateSessionDto,
    tenantId: string,
  ): Promise<Session> {
    try {
      const session = await this.findOneSession(id);
      if (!session) {
        throw new NotFoundException(`Session Not Found`);
      }
      if (updateSessionDto.months && updateSessionDto.months.length > 0) {
        const months = updateSessionDto.months;
        delete updateSessionDto.months;
        await this.monthService.updateBulkMonth(months, tenantId);
      }
      await this.sessionRepository.update({ id }, updateSessionDto);

      return await this.findOneSession(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async removeSession(id: string): Promise<Session> {
    try {
      const session = await this.findOneSession(id);
      if (!session) {
        throw new NotFoundException(`Session Not Found`);
      }
      await this.sessionRepository.softRemove({ id });
      return session;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getActiveSession(tenantId: string): Promise<Session> {
    try {
      const session = await this.sessionRepository.findOneOrFail({
        where: { tenantId: tenantId, active: true },
        relations: ['months'],
      });
      return session;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getActiveSessionOfAllTenants(): Promise<Session> {
    try {
      const session = await this.sessionRepository.findOneOrFail({
        where: { active: true },
      });
      return session;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async activateSession(
    sessionToBeUpdatedId: string,
    tenantId: string,
  ): Promise<Session> {
    try {
      const activeMonth = await this.getActiveSession(tenantId);

      if (activeMonth) {
        const updateSession = new UpdateSessionDto();
        updateSession.active = false;
        await this.updateSession(activeMonth.id, updateSession, tenantId);
      }
      const updateSession = new UpdateSessionDto();
      updateSession.active = true;
      return await this.updateSession(
        sessionToBeUpdatedId,
        updateSession,
        tenantId,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
