import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { WorkSchedule } from './entities/work-schedule.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { OrganizationsService } from '../organizations/organizations.service';
import { CreateOrganizationDto } from '../organizations/dto/create-organization.dto';

@Injectable()
export class WorkSchedulesService {
  constructor(
    @InjectRepository(WorkSchedule)
    private workScheduleRepository: Repository<WorkSchedule>,
    private paginationService: PaginationService,
    private organizationsService: OrganizationsService,
  ) {}
  async createWorkSchedule(
    createWorkScheduleDto: CreateWorkScheduleDto,
    tenantId: string,
  ): Promise<WorkSchedule> {
    try {
      const createWorkSchedule = await this.workScheduleRepository.create({
        ...createWorkScheduleDto,
        tenantId: tenantId,
      });
      const WorkSchedule = await this.workScheduleRepository.save(
        createWorkSchedule,
      );
      const organizationData = new CreateOrganizationDto();
      organizationData.workScheduleId = WorkSchedule.id;
      await this.organizationsService.createOrganiztion(
        organizationData,
        tenantId,
      );
      return WorkSchedule;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllWorkSchedules(
    paginationOptions: PaginationDto,
    tenantId: string,
  ): Promise<Pagination<WorkSchedule>> {
    const options: IPaginationOptions = {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };

    const paginatedData = await this.paginationService.paginate<WorkSchedule>(
      this.workScheduleRepository,
      'p',
      options,
      paginationOptions.orderBy,
      paginationOptions.orderDirection,
      { tenantId },
    );

    return paginatedData;
  }

  async findOneWorkSchedule(id: string): Promise<WorkSchedule> {
    try {
      const client = await this.workScheduleRepository.findOneByOrFail({ id });
      return client;
    } catch (error) {
      throw new NotFoundException(`WorkSchedule with Id ${id} not found`);
    }
  }

  async updateWorkSchedule(
    id: string,
    updateWorkScheduleDto: UpdateWorkScheduleDto,
  ): Promise<WorkSchedule> {
    try {
      const WorkSchedule = await this.findOneWorkSchedule(id);
      if (!WorkSchedule) {
        throw new NotFoundException(`WorkSchedule with Id ${id} not found`);
      }

      const updatedWorkSchedule = await this.workScheduleRepository.update(
        id,
        updateWorkScheduleDto,
      );
      return await this.findOneWorkSchedule(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async removeWorkSchedule(id: string): Promise<WorkSchedule> {
    const WorkSchedule = await this.findOneWorkSchedule(id);
    if (!WorkSchedule) {
      throw new NotFoundException(`Client with Id ${id} not found`);
    }
    await this.workScheduleRepository.softRemove({ id });
    return WorkSchedule;
  }
}
