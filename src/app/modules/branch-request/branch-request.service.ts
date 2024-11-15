import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchRequest } from './entities/branch-request.entity'; // assuming you have a BranchRequest entity
import { CreateBranchRequestDto } from './dto/create-branch-request.dto';
import { UpdateBranchRequestDto } from './dto/update-branch-request.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Branch } from '../branchs/entities/branch.entity';
import { PaginationService } from '@root/src/core/pagination/pagination.service';

@Injectable()
export class BranchRequestService {
  constructor(
    @InjectRepository(BranchRequest)
    private branchRequestRepository: Repository<BranchRequest>,
    private paginationService: PaginationService,
  ) {}

  async create(
    createBranchRequestDto: CreateBranchRequestDto,
    tenantId: string,
  ): Promise<BranchRequest> {
    try {
      const newBranchRequest = this.branchRequestRepository.create({
        ...createBranchRequestDto,
        tenantId: tenantId,
      });
      return await this.branchRequestRepository.save(newBranchRequest);
    } catch (error) {
      throw new BadRequestException('Error creating branch request', error);
    }
  }

  async findAll(
    paginationOptions: PaginationDto,
    tenantId: string,
  ): Promise<Pagination<BranchRequest>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };

      const paginatedData =
        await this.paginationService.paginate<BranchRequest>(
          this.branchRequestRepository,
          'p',
          options,
          paginationOptions.orderBy,
          paginationOptions.orderDirection,
          { tenantId },
        );

      return paginatedData;
    } catch (error) {
      throw new BadRequestException(
        'Error retrieving branch requests',
        error.message,
      );
    }
  }

  async findOne(id: string): Promise<BranchRequest> {
    try {
      const branchRequest = await this.branchRequestRepository.findOneByOrFail({
        id,
      });
      return branchRequest;
    } catch (error) {
      throw new NotFoundException(`BranchRequest with Id ${id} not found`);
    }
  }

  async update(
    id: string,
    updateBranchRequestDto: UpdateBranchRequestDto,
  ): Promise<BranchRequest> {
    try {
      const branchRequest = await this.findOne(id);
      if (!branchRequest) {
        throw new NotFoundException(`BranchRequest with Id ${id} not found`);
      }
      const updatedBranchRequest = await this.branchRequestRepository.update(
        id,
        updateBranchRequestDto,
      );
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      const branchRequest = await this.findOne(id);
      if (!branchRequest) {
        throw new NotFoundException(`BranchRequest with Id ${id} not found`);
      }
      await this.branchRequestRepository.softRemove({ id });
      return branchRequest;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
