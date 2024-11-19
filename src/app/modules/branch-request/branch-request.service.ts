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
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BranchRequestService {
  private readonly orgStructureServerUrl: string;
  constructor(
    @InjectRepository(BranchRequest)
    private branchRequestRepository: Repository<BranchRequest>,
    private paginationService: PaginationService,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.orgStructureServerUrl = this.configService.get<string>(
      'servicesUrl.org_structureUrl',
    );
  }

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

      const queryBuilder = this.branchRequestRepository
        .createQueryBuilder('branchrequest')
        .leftJoinAndSelect('branchrequest.currentBranch', 'currentBranch') // Join currentBranchId to fetch branch data
        .leftJoinAndSelect('branchrequest.requestBranch', 'requestBranch') // Join requestBranchId to fetch branch data
        .where('branchrequest.tenantId = :tenantId', { tenantId }) // Filter by tenantId
        .orderBy(
          `branchrequest.${paginationOptions.orderBy || 'createdAt'}`,
          paginationOptions.orderDirection || 'DESC',
        );

      // Pagination handling using `paginate`
      const paginatedData = await this.paginationService.paginate(
        queryBuilder,
        options,
      );

      return paginatedData;
    } catch (error) {
      throw new BadRequestException(
        'Error retrieving branch requests',
        error.message,
      );
    }
  }

  async findAllBranchRequestwithApprover(
    paginationOptions: PaginationDto,
    tenantId: string,
    userId: string,
  ): Promise<BranchRequest[]> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page || 1,
        limit: paginationOptions.limit || 10,
      };
      const branchRequests = await this.branchRequestRepository
        .createQueryBuilder('branchrequest')
        .where('branchrequest.tenantId = :tenantId', { tenantId })
        .getMany();

      const response = await this.httpService
        .get(`${this.orgStructureServerUrl}/approver/branchCurrentApprover`, {
          params: {
            branchRequests: JSON.stringify(branchRequests),
          },
          headers: { tenantId },
        })
        .toPromise();

      const responseData = response.data;
      console.log(responseData, 'responseData');
      if (responseData?.items?.length > 0) {
        const filteredData = responseData.items
          .map((approver) => ({
            ...approver,
            nextApprover: approver.nextApprover?.filter(
              (next) => next.userId === userId,
            ),
          }))
          .filter((approver) => approver.nextApprover?.length > 0);

        return filteredData;
      }
      // You might want to merge or map `responseData` to `paginatedData` here if needed
      return responseData;
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
        id: id,
      });
      return branchRequest;
    } catch (error) {
      throw new NotFoundException(`BranchRequest with Id ${id} not found`);
    }
  }
  async findAll_BasedOnUser(
    paginationOptions: PaginationDto,
    userId: string,
  ): Promise<Pagination<BranchRequest>> {
    const options: IPaginationOptions = {
      page: paginationOptions.page || 1,
      limit: paginationOptions.limit || 10,
    };
    try {
      const paginatedData =
        await this.paginationService.paginate<BranchRequest>(
          this.branchRequestRepository,
          'branchRequest',
          options,
          paginationOptions.orderBy,
          paginationOptions.orderDirection,
          { userId }, // Add the filtering condition for userId
        );

      if (!paginatedData.items.length) {
        throw new NotFoundException(
          `No BranchRequests found for userId ${userId}`,
        );
      }

      return paginatedData;
    } catch (error) {
      throw new NotFoundException(
        `Error retrieving BranchRequests for userId ${userId}: ${error.message}`,
      );
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
