import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMonthDto } from './dto/create-month.dto';
import { UpdateMonthDto } from './dto/update-month.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Month } from './entities/month.entity';
import { QueryRunner, Repository, LessThanOrEqual, LessThan } from 'typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';

@Injectable()
export class MonthService {
  constructor(
    @InjectRepository(Month)
    private monthRepository: Repository<Month>,
    private readonly paginationService: PaginationService,
  ) {}
  async createMonth(
    createMonthDto: CreateMonthDto,
    tenantId: string,
    queryRunner?: QueryRunner,
  ): Promise<Month> {
    try {
      const todaysDay = new Date();
      const startDate = new Date(createMonthDto.startDate);
      const endDate = new Date(createMonthDto.endDate);
      if (
        todaysDay.toISOString().split('T')[0] >=
          startDate.toISOString().split('T')[0] &&
        todaysDay.toISOString().split('T')[0] <=
          endDate.toISOString().split('T')[0]
      ) {
        createMonthDto.active = true;
      }
      const createdMonth = queryRunner
        ? queryRunner.manager.create(Month, {
            ...createMonthDto,
            tenantId,
          })
        : this.monthRepository.create({
            ...createMonthDto,
            tenantId,
          });
      return queryRunner
        ? await queryRunner.manager.save(Month, createdMonth)
        : await this.monthRepository.save(createdMonth);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllMonths(
    tenantId: string,
    paginationOptions?: PaginationDto,
  ): Promise<Pagination<Month>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };

      const queryBuilder = this.monthRepository
        .createQueryBuilder('Month')
        .leftJoinAndSelect('Month.session', 'session')
        .leftJoinAndSelect('session.calendar', 'calendar')
        .where('Month.tenantId = :tenantId', { tenantId })
        .andWhere('calendar.isActive = :isActive', { isActive: true });

      const paginatedData = await this.paginationService.paginate<Month>(
        queryBuilder,
        options,
      );

      return paginatedData;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneMonth(id: string): Promise<Month> {
    try {
      const month = await this.monthRepository.findOne({
        where: { id: id },
        relations: ['session', 'session.calendar'],
      });
      return month;
    } catch (error) {
      throw new NotFoundException(`Month Not Found`);
    }
  }

  async updateMonth(
    id: string,
    updateMonthDto: UpdateMonthDto,
    tenantId: string,
    setMonth?: boolean,
  ): Promise<Month> {
    try {
      const month = await this.findOneMonth(id);
      if (!month) {
        throw new NotFoundException(`Month Not Found`);
      }
      if (setMonth) {
        updateMonthDto.active = setMonth;
      }
      await this.monthRepository.update({ id }, updateMonthDto);
      return await this.findOneMonth(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateBulkMonth(
    updateMonthDto: UpdateMonthDto[],
    tenantId: string,
    setMonth?: boolean,
  ): Promise<Month[]> {
    try {
      const months = await Promise.all(
        updateMonthDto.map((item) => {
          const createDto = new CreateMonthDto();
          createDto.description = item.description;
          createDto.name = item.name;
          createDto.startDate = item.startDate;
          createDto.endDate = item.endDate;
          if (item.id) {
            return this.updateMonth(item.id, createDto, tenantId, setMonth);
          } else {
            const createDto = item as CreateMonthDto;
            return this.createMonth(createDto, tenantId);
          }
        }),
      );
      return months;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async removeMonth(id: string): Promise<Month> {
    try {
      const month = await this.findOneMonth(id);
      if (!Month) {
        throw new NotFoundException(`Month Not Found`);
      }
      await this.monthRepository.softRemove({ id });
      return month;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async geActiveMonth(tenantId: string): Promise<Month> {
    try {
      const month = await this.monthRepository.findOneOrFail({
        where: { tenantId: tenantId, active: true },
      });
      return month;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async geActiveMonthOfAllTenants(): Promise<Month> {
    try {
      const month = await this.monthRepository.findOneOrFail({
        where: { active: true },
      });
      return month;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async activateMonth(
    monthToBeUpdatedId: string,
    tenantId: string,
  ): Promise<Month> {
    try {
      const activeMonth = await this.geActiveMonth(tenantId);
      if (activeMonth) {
        const updateMonth = new UpdateMonthDto();
        updateMonth.active = false;
        await this.updateMonth(activeMonth.id, updateMonth, tenantId);
      }

      const updateMonth = new UpdateMonthDto();
      updateMonth.active = true;
      return await this.updateMonth(monthToBeUpdatedId, updateMonth, tenantId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async activatePreviousActiveMonth(tenantId: string): Promise<Month> {
    try {
      const activeMonth = await this.geActiveMonth(tenantId);

      if (!activeMonth) {
        throw new BadRequestException('Active month not found');
      }

      // Get all inactive months and filter by date-only comparison
      const allInactiveMonths = await this.monthRepository.find({
        where: {
          tenantId,
          active: false,
        },
        order: { endDate: 'DESC' }, // Most recent months first
      });

      // Compare only the date part (YYYY-MM-DD) without timezone
      const activeMonthStartDate = activeMonth.startDate
        .toISOString()
        .split('T')[0];

      const previousMonth = allInactiveMonths.find((m) => {
        const monthEndDate = m.endDate.toISOString().split('T')[0];
        return monthEndDate < activeMonthStartDate;
      });

      if (!previousMonth) {
        throw new BadRequestException('No previous month found');
      }

      return previousMonth;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
