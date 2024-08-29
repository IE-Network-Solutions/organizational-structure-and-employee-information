import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOffboardingTasksTemplateDto } from './dto/create-offboarding-tasks-template.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { OffboardingTasksTemplate } from './entities/offboarding-tasks-template..entity';
import { UpdateOffboardingTasksTemplateDto } from './dto/update-offboarding-tasks-template..dto';

@Injectable()
export class OffboardingTasksTemplateService {
  constructor(
    @InjectRepository(OffboardingTasksTemplate)
    private readonly offboardingTasksTemplateRepository: Repository<OffboardingTasksTemplate>,
    private readonly paginationService: PaginationService,
  ) { }

  async create(tenantId: string, createOffboardingTasksTemplateDto: CreateOffboardingTasksTemplateDto) {
    const taskTemplate = this.offboardingTasksTemplateRepository.create({
      ...createOffboardingTasksTemplateDto,
      tenantId,
    });
    return await this.offboardingTasksTemplateRepository.save(taskTemplate);
  }

  async findAll(paginationOptions: PaginationDto): Promise<Pagination<OffboardingTasksTemplate>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = this.offboardingTasksTemplateRepository.createQueryBuilder('offboardingTasksTemplate');

      return await this.paginationService.paginate<OffboardingTasksTemplate>(queryBuilder, options);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`OffboardingTasksTemplate not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.offboardingTasksTemplateRepository.findOne({ where: { id } });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`offboardingTasksTemplate not found.`);
      }
      throw error;
    }
  }

  async update(id: string, updateOffboardingTasksTemplateDto: UpdateOffboardingTasksTemplateDto) {

    try {
      await this.findOne(id);
      const result = await this.offboardingTasksTemplateRepository.update(id, {
        ...updateOffboardingTasksTemplateDto
      });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`offboardingTasksTemplate not found.`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.offboardingTasksTemplateRepository.softDelete(id);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`offboardingTasksTemplate not found.`);
      }
      throw error;
    }
  }
}
