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
  ) {}
  async createBranch(
    createBranchDto: CreateBranchDto,
    tenantId: string,
  ): Promise<Branch> {
    try {
      const branchExist = await this.branchRepository.findOne({
        where: { name: createBranchDto.name, tenantId: tenantId },
      });
      const branchEmail = await this.branchRepository.findOne({
        where: {
          contactEmail: createBranchDto.contactEmail,
          tenantId: tenantId,
        },
      });
      if (branchEmail || branchExist) {
        throw new NotFoundException(`Branch with Email Or Name Already exist`);
      }
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
    tenantId: string,
  ): Promise<Branch> {
    try {
      const existingBranch = await this.findOneBranch(id);
      if (!existingBranch) {
        throw new NotFoundException(`Branch with Id ${id} not found`);
      }

      // Check for duplicate name only if the name is being changed
      if (
        updateBranchDto.name &&
        updateBranchDto.name !== existingBranch.name
      ) {
        const branchExist = await this.branchRepository.findOne({
          where: { name: updateBranchDto.name, tenantId: tenantId },
        });

        if (branchExist) {
          throw new BadRequestException(
            `Branch with name '${updateBranchDto.name}' already exists`,
          );
        }
      }

      await this.branchRepository.update(id, updateBranchDto);
      return await this.findOneBranch(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async removeBranch(id: string): Promise<Branch> {
    try {
      const branch = await this.findOneBranch(id);
      if (!branch) {
        throw new NotFoundException(`Branch with Id ${id} not found`);
      }
      await this.branchRepository.softRemove({ id });
      return branch;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
