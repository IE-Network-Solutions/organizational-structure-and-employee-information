import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMonthDto } from './dto/create-month.dto';
import { UpdateMonthDto } from './dto/update-month.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Month } from './entities/month.entity';
import { QueryRunner, Repository, LessThanOrEqual } from 'typeorm';
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
        where: { id: id },relations: ['session','session.calendar'],
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
  ): Promise<Month> {
    try {
      const month = await this.findOneMonth(id);
      if (!month) {
        throw new NotFoundException(`Month Not Found`);
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
  ): Promise<Month[]> {
    try {
      const months = await Promise.all(
        updateMonthDto.map((item) => {
          const createDto = new  CreateMonthDto();
          createDto.description=item.description
          createDto.name=item.name
          createDto.startDate=item.startDate  
          createDto.endDate=item.endDate 
          if (item.id) {
            return this.updateMonth(item.id, createDto, tenantId);
          } else {
            const createDto = item as CreateMonthDto; 
            return this.createMonth(createDto, tenantId);
          }
        }),
      );
      return months;
    }catch (error) {
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

      // Find the previous month by looking for the month that ends closest to (but not after) the active month starts
      
      // First, let's see all available months for this tenant
      const allMonths = await this.monthRepository.find({
        where: { tenantId, active: false },
        order: { endDate: 'DESC' }
      });
      
      // Let's also check for exact matches - get the most recent month they can be equal
      const exactMatch = allMonths.find(m => m.endDate.getTime() === activeMonth.startDate.getTime());
      
      // If we found an exact match, use it; otherwise use the query
      let previousMonth;
      if (exactMatch) {
        previousMonth = exactMatch;
      } else {
        // Find the month that ends closest to (but not after) the active month starts
        previousMonth = await this.monthRepository.findOne({
          where: { 
            tenantId, 
            active: false,
            endDate: LessThanOrEqual(activeMonth.startDate)
          },
          order: { endDate: 'DESC' } // Get the month that ends closest to active month start
        });
      }
      
      return previousMonth;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
