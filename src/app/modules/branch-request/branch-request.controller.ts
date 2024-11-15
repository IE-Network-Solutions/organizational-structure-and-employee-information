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
    @Req() req: Request, // Get tenantId from request
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
    @Req() req: Request, // Get tenantId from request
    @Query()
    paginationOptions?: PaginationDto,
  ): Promise<Pagination<BranchRequest>> {
    const tenantId = req['tenantId'];
    return await this.branchRequestService.findAll(paginationOptions, tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BranchRequest> {
    return await this.branchRequestService.findOne(id);
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
