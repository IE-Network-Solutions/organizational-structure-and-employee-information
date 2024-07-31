import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch) private branchRepository: Repository<Branch>,
    private paginationService: PaginationService,
  ) { }
  async createBranch(
    createBranchDto: CreateBranchDto,
    tenantId: string,
  ): Promise<Branch> {
    try {
      const createBranch = await this.branchRepository.create({
        ...createBranchDto,
        tenantId: tenantId,
      });
      return await this.branchRepository.save(createBranch);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllBranchs(
    paginationOptions: PaginationDto,
    tenantId: string,
  ): Promise<Pagination<Branch>> {
    const options: IPaginationOptions = {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };

    const paginatedData = await this.paginationService.paginate<Branch>(
      this.branchRepository,
      'p',
      options,
      paginationOptions.orderBy,
      paginationOptions.orderDirection,
      { tenantId },
    );

    return paginatedData;
  }

  async findOneBranch(id: string): Promise<Branch> {
    try {
      const client = await this.branchRepository.findOneByOrFail({ id });
      return client;
    } catch (error) {
      throw new NotFoundException(`Branch with Id ${id} not found`);
    }
  }
  async updateBranch(
    id: string,
    updateBranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    try {
      const Branch = await this.findOneBranch(id);
      if (!Branch) {
        throw new NotFoundException(`Branch with Id ${id} not found`);
      }
      const updatedBranch = await this.branchRepository.update(
        id,
        updateBranchDto,
      );
      return await this.findOneBranch(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async removeBranch(id: string): Promise<Branch> {
    const Branch = await this.findOneBranch(id);
    if (!Branch) {
      throw new NotFoundException(`Client with Id ${id} not found`);
    }
    await this.branchRepository.softRemove({ id });
    return Branch;
  }
}
