import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { JobPositionService } from './job-position.service';
import { CreateJobPositionDto } from './dto/create-job-position.dto';
import { UpdateJobPositionDto } from './dto/update-job-position.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express'; // Explicitly type the request object
import { JobPosition } from './entities/job-position.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import { ExcludeAuthGuard } from '@root/src/core/guards/exclud.guard';

@Controller('positions')
@ApiTags('Job-Position')
export class JobPositionController {
  constructor(private readonly jobPositionService: JobPositionService) {}

  @Post()
  @ExcludeAuthGuard()
  create(
    @Req() request: Request,
    @Body() createJobPositionDto: CreateJobPositionDto,
  ) {
    const tenantId = request['tenantId'];
    return this.jobPositionService.create(tenantId, createJobPositionDto);
  }

  @Get()
  findAll(
    @Req() request: Request,
    @Query() paginationOptions?: PaginationDto,
    @Query() searchFilterDTO?: SearchFilterDTO, // Correct parameter naming
  ) {
    const tenantId = request['tenantId'];
    return this.jobPositionService.findAll(
      paginationOptions,
      searchFilterDTO,
      request['tenantId'],
    );
  }

  @Get(':id')
  async findOnePosition(@Param('id') id: string): Promise<JobPosition> {
    return this.jobPositionService.findOnePosition(id);
  }

  @Put(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateJobPositionDto: UpdateJobPositionDto,
  ) {
    const tenantId = request['tenantId'];
    return this.jobPositionService.update(id, tenantId, updateJobPositionDto);
  }

  @Delete(':id')
  @ExcludeAuthGuard()
  remove(@Param('id') id: string) {
    return this.jobPositionService.remove(id);
  }
}
