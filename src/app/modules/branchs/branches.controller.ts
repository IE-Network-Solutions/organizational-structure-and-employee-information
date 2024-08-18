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
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags } from '@nestjs/swagger';
@Controller('branchs')
@ApiTags('Branchs')
export class BranchesController {
  constructor(private readonly branchsService: BranchesService) {}
  @Post()
  async createBranch(
    @Req() req: Request,
    @Body() createBranchDto: CreateBranchDto,
  ): Promise<Branch> {
    const tenantId = req['tenantId'];
    return await this.branchsService.createBranch(createBranchDto, tenantId);
  }

  @Get()
  async findAllBranch(
    @Req() req: Request,
    @Query()
    paginationOptions?: PaginationDto,
  ): Promise<Pagination<Branch>> {
    const tenantId = req['tenantId'];
    return await this.branchsService.findAllBranchs(
      paginationOptions,
      tenantId,
    );
  }

  @Get(':id')
  async findOneBranch(@Param('id') id: string): Promise<Branch> {
    return await this.branchsService.findOneBranch(id);
  }

  @Patch(':id')
  async updateBranch(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    return await this.branchsService.updateBranch(id, updateBranchDto);
  }

  @Delete(':id')
  async removeBranch(@Param('id') id: string): Promise<Branch> {
    return await this.branchsService.removeBranch(id);
  }
}
