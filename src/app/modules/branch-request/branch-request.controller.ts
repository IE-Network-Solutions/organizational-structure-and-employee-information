import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  BadRequestException,
  Headers,
  Header,
} from '@nestjs/common';
import { BranchRequestService } from './branch-request.service';
import { CreateBranchRequestDto } from './dto/create-branch-request.dto';
import { UpdateBranchRequestDto } from './dto/update-branch-request.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { BranchRequest } from './entities/branch-request.entity';
import { ApiTags } from '@nestjs/swagger';
import { paginationOptions } from '@root/src/core/commonTestData/commonTest.data';

@Controller('branch-request')
@ApiTags('BranchRequest')
export class BranchRequestController {
  constructor(private readonly branchRequestService: BranchRequestService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createBranchRequestDto: CreateBranchRequestDto,
  ) {
    const tenantId = req['tenantId'];
    return await this.branchRequestService.create(
      createBranchRequestDto,
      tenantId,
    );
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query()
    paginationOptions?: PaginationDto,
  ): Promise<Pagination<BranchRequest>> {
    const tenantId = req['tenantId'];
    return await this.branchRequestService.findAll(paginationOptions, tenantId);
  }

  @Get('BranchRequestwithApprover/:userId')
  async findAllBranchRequestWithApprover(
    @Param('userId') userId: string,
    @Req() req: Request,
    @Query() paginationOptions: PaginationDto,
    @Headers('tenantId') tenantId: string,
  ): Promise<{ items: BranchRequest[]; meta: any; links: any }> {
    return this.branchRequestService.findAllBranchRequestWithApprover(
      paginationOptions,
      userId,
      tenantId,
    );
  }

  @Get(':userId')
  async findAll_BasedOnUser(
    @Param('userId') userId: string,
    @Query() paginationOptions: PaginationDto,
  ): Promise<Pagination<BranchRequest>> {
    return await this.branchRequestService.findAll_BasedOnUser(
      paginationOptions,
      userId,
    );
  }

  @Get('request/:id')
  async findBranch(@Param('id') id: string): Promise<BranchRequest> {
    return await this.branchRequestService.findBranch(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBranchRequestDto: UpdateBranchRequestDto,
  ): Promise<BranchRequest> {
    return await this.branchRequestService.update(id, updateBranchRequestDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<BranchRequest> {
    return await this.branchRequestService.remove(id);
  }
}
