import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchRequest } from './entities/branch-request.entity';
import { CreateBranchRequestDto } from './dto/create-branch-request.dto';
import { UpdateBranchRequestDto } from './dto/update-branch-request.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Branch } from '../branchs/entities/branch.entity';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { BranchRequestStatus } from './enum/Branch-request-status.enum';
import { EmployeeJobInformationService } from '../employee-job-information/employee-job-information.service';

@Injectable()
export class BranchRequestService {
  private readonly approvalUrl: string;

  constructor(
    @InjectRepository(BranchRequest)
    private branchRequestRepository: Repository<BranchRequest>,
    private paginationService: PaginationService,
    private employeeJobInformationService: EmployeeJobInformationService,

    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.approvalUrl = this.configService.get<string>(
      'servicesUrl.approvalUrl',
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
        .leftJoinAndSelect('branchrequest.currentBranch', 'currentBranch')
        .leftJoinAndSelect('branchrequest.requestBranch', 'requestBranch')
        .where('branchrequest.tenantId = :tenantId', { tenantId })
        .orderBy(
          `branchrequest.${paginationOptions.orderBy || 'createdAt'}`,
          paginationOptions.orderDirection || 'DESC',
        );

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

  async findAllBranchRequestWithApprover(
    paginationOptions: PaginationDto,
    userId: string,
    tenantId: string,
  ): Promise<{ items: BranchRequest[]; meta: any; links: any }> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page || 1,
        limit: paginationOptions.limit || 10,
      };

      const query = this.branchRequestRepository
        .createQueryBuilder('branchrequest')
        .leftJoinAndSelect('branchrequest.currentBranch', 'currentBranch')
        .leftJoinAndSelect('branchrequest.requestBranch', 'requestBranch')
        .orderBy(
          `branchrequest.${paginationOptions.orderBy || 'createdAt'}`,
          paginationOptions.orderDirection || 'DESC',
        );

      const paginatedData =
        await this.paginationService.paginate<BranchRequest>(query, options);

      const branchRequests = paginatedData.items;
      // Handle empty results
      if (!branchRequests.length) {
        return {
          items: [],
          meta: paginatedData.meta,
          links: paginatedData.links,
        };
      }

      let responseData;
      try {
        const response = await this.httpService
          .get(`${this.approvalUrl}/approver/branchCurrentApprover`, {
            params: { branchRequests: JSON.stringify(branchRequests) },
            headers: { tenantId },
          })
          .toPromise();

        responseData = response?.data;
        if (!responseData || !responseData.items) {
          throw new Error('Invalid response from approver API');
        }
      } catch (apiError) {
        throw new BadRequestException('Failed to fetch approver data.');
      }

      // Ensure items exist before filtering
      const filteredLastTrueApprovals =
        responseData?.items?.filter((item) => item.last === true) || [];

      for (const approverRequest of filteredLastTrueApprovals) {
        try {
          const approverAction = approverRequest.approverAction;
          const updateapproverRequestDto = {
            status:
              approverAction === 'Rejected'
                ? BranchRequestStatus.DECLINED
                : BranchRequestStatus.APPROVED,
          };

          await this.update(approverRequest.id, updateapproverRequestDto);

          if (approverAction !== 'Rejected') {
            const updateEmployeeJobInformationDto = {
              branchId: approverRequest.requestBranchId,
            };

            await this.employeeJobInformationService.updatebranchRequest(
              approverRequest.userId,
              updateEmployeeJobInformationDto,
            );
          }
        } catch (updateError) {
          throw new BadRequestException(
            `Error updating approver request: ${updateError.message}`,
          );
        }
      }

      if (responseData?.items?.length > 0) {
        const filteredData = responseData.items
          .map((approver) => ({
            ...approver,
            nextApprover: approver.nextApprover?.filter(
              (next) => next.userId === userId,
            ),
          }))
          .filter((approver) => approver.nextApprover?.length > 0);

        return {
          items: filteredData,
          meta: paginatedData.meta,
          links: paginatedData.links,
        };
      }

      return {
        items: [],
        meta: paginatedData.meta,
        links: paginatedData.links,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error retrieving branch requests: ${error.message || 'Unknown error'}`,
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

  async findBranch(id: string): Promise<BranchRequest> {
    try {
      const branchRequest = await this.branchRequestRepository
        .createQueryBuilder('branchrequest')
        .leftJoinAndSelect('branchrequest.currentBranch', 'currentBranch')
        .leftJoinAndSelect('branchrequest.requestBranch', 'requestBranch')
        .where('branchrequest.id = :id', { id })
        .getOne();

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
      const queryBuilder = this.branchRequestRepository
        .createQueryBuilder('branchrequest')
        .leftJoinAndSelect('branchrequest.currentBranch', 'currentBranch')
        .leftJoinAndSelect('branchrequest.requestBranch', 'requestBranch')
        .where('branchrequest.userId = :userId', { userId });

      if (paginationOptions.orderBy) {
        queryBuilder.orderBy(
          `branchrequest.${paginationOptions.orderBy}`,
          paginationOptions.orderDirection || 'ASC',
        );
      }

      const paginatedData =
        await this.paginationService.paginate<BranchRequest>(
          queryBuilder,
          options,
        );

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

      await this.branchRequestRepository.softRemove({ id });
      return branchRequest;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Remove Error');
    }
  }
}
