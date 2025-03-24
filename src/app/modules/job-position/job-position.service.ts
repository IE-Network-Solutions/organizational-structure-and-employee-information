import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobPositionDto } from './dto/create-job-position.dto';
import { UpdateJobPositionDto } from './dto/update-job-position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPosition } from './entities/job-position.entity';

import { Repository } from 'typeorm';

import { promises } from 'dns';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { applySearchFilterUtils } from '@root/src/core/utils/search-filter.utils';

@Injectable()
export class JobPositionService {
  constructor(
    @InjectRepository(JobPosition)
    private jobpositionRepository: Repository<JobPosition>,
    private readonly paginationService: PaginationService,
  ) {}
  async create(
    tenantId: string,
    createJobPositionDto: CreateJobPositionDto,
  ): Promise<JobPosition> {
    try {
      console.log(createJobPositionDto,"createJobPositionDto")
      // Check if the job position already exists for the tenant
      const existingJobPosition = await this.jobpositionRepository.findOne({
        where: { name: createJobPositionDto.name, tenantId: tenantId },
      });

      // If the job position exists, throw a conflict exception
      if (existingJobPosition) {
        throw new ConflictException(
          `Job Position with name "${createJobPositionDto.name}" already exists for this tenant.`,
        );
      }

      // Create a new job position
      const newJobPosition = this.jobpositionRepository.create({
        ...createJobPositionDto,
        tenantId: tenantId,
      });

      // Save the new job position to the database
      return await this.jobpositionRepository.save(newJobPosition);
    } catch (error) {
      // Catch any unexpected errors and rethrow them as internal server errors
      throw new InternalServerErrorException(
        `An error occurred while creating the job position: ${error.message}`,
      );
    }
  }

  async findAll(
    paginationOptions: PaginationDto,
    searchFilterDTO: SearchFilterDTO,
    tenantId: string,
  ): Promise<Pagination<JobPosition>> {
    const options: IPaginationOptions = {
      page: paginationOptions?.page,
      limit: paginationOptions?.limit,
    };
    try {
      const queryBuilder =
        this.jobpositionRepository.createQueryBuilder('JobPosition');
      await applySearchFilterUtils(
        queryBuilder,
        searchFilterDTO,
        this.jobpositionRepository,
      );
      const paginatedData = await this.paginationService.paginate<JobPosition>(
        this.jobpositionRepository,
        'JobPosition',
        options,
        paginationOptions.orderBy,
        paginationOptions.orderDirection,
        { tenantId },
      );
      return paginatedData;
    } catch (error) {
      if (error.name == 'EntityNotFoundError') {
        throw new NotFoundException(`position not found`);
      }
    }
  }

  async findOnePosition(id: string): Promise<JobPosition> {
    try {
      const position = await this.jobpositionRepository.findOneByOrFail({ id });
      return position;
    } catch {
      throw new NotFoundException(`Position with Id ${id} not found`);
    }
  }

  async update(
    id: string,
    tenantId: string,
    updateJobPositionDto: UpdateJobPositionDto,
  ): Promise<JobPosition> {
    try {
      // Ensure the job position exists before updating
      const existingJobPosition = await this.findOnePosition(id);
      if (!existingJobPosition) {
        throw new NotFoundException(`Position with id ${id} not found`);
      }

      // Perform the update operation
      await this.jobpositionRepository.update(id, {
        name: updateJobPositionDto.name,
        description: updateJobPositionDto.description,
        tenantId: tenantId, // Including tenantId if needed
      });

      // Return the updated job position
      return await this.findOnePosition(id);
    } catch (error) {
      if (
        error.name === 'EntityNotFoundError' ||
        error instanceof NotFoundException
      ) {
        throw new NotFoundException(`Position with id ${id} not found`);
      }
      // Catch any unexpected errors
      throw new InternalServerErrorException(
        `An error occurred while updating the job position: ${error.message}`,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.findOnePosition(id);
      return await this.jobpositionRepository.softDelete({ id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Position with id ${id} not found.`);
      }
      throw error;
    }
  }
}
