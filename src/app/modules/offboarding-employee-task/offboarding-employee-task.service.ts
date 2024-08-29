import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OffboardingEmployeeTask } from './entities/offboarding-employee-task.entity';
import { CreateOffboardingEmployeeTaskDto } from './dto/create-offboarding-employee-task.dto';
import { UpdateOffboardingEmployeeTaskDto } from './dto/update-offboarding-employee-task.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '@root/src/core/pagination/pagination.service';

@Injectable()
export class OffboardingEmployeeTaskService {
  constructor(
    @InjectRepository(OffboardingEmployeeTask)
    private readonly offboardingEmployeeTaskRepository: Repository<OffboardingEmployeeTask>,
    private readonly paginationService: PaginationService,

  ) { }

  async create(tenantId: string, createOffboardingEmployeeTaskDto: CreateOffboardingEmployeeTaskDto) {
    const task = this.offboardingEmployeeTaskRepository.create({ ...createOffboardingEmployeeTaskDto, tenantId });
    return await this.offboardingEmployeeTaskRepository.save(task);
  }

  async findAll(
    paginationOptions: PaginationDto,
  ): Promise<Pagination<OffboardingEmployeeTask>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder =
        await this.offboardingEmployeeTaskRepository.createQueryBuilder(
          'offboardingEmployeeTask',
        );

      return await this.paginationService.paginate<OffboardingEmployeeTask>(
        queryBuilder,
        options,
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`offboardingEmployeeTask not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string) {
    return await this.offboardingEmployeeTaskRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateOffboardingEmployeeTaskDto: UpdateOffboardingEmployeeTaskDto, tenantId: string) {
    await await this.offboardingEmployeeTaskRepository.update(id, { ...updateOffboardingEmployeeTaskDto, tenantId });
    return await this.findOne(id);
  }

  async remove(id: string) {
    return await this.offboardingEmployeeTaskRepository.delete(id);
  }
}
