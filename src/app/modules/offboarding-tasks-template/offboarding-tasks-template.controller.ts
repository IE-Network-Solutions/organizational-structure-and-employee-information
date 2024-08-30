import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { OffboardingTasksTemplateService } from './offboarding-tasks-template.service';
import { CreateOffboardingTasksTemplateDto } from './dto/create-offboarding-tasks-template.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OffboardingTasksTemplate } from './entities/offboarding-tasks-template..entity';
import { UpdateOffboardingTasksTemplateDto } from './dto/update-offboarding-tasks-template..dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { ApiTags } from '@nestjs/swagger';
import { tenantId } from '../branchs/tests/branch.data';

@Controller('offboarding-tasks-template')
@ApiTags('Offboarding Tasks Template')
export class OffboardingTasksTemplateController {
  constructor(private readonly offboardingTasksTemplateService: OffboardingTasksTemplateService) { }

  @Post()
  create(
    @Req() request: Request,
    @Body() createOffboardingTasksTemplateDto: CreateOffboardingTasksTemplateDto,
  ): Promise<OffboardingTasksTemplate> {
    return this.offboardingTasksTemplateService.create(request['tenantId'], createOffboardingTasksTemplateDto);
  }

  @Get()
  findAll(@Req() request: Request, @Query() paginationOptions: PaginationDto): Promise<Pagination<OffboardingTasksTemplate>> {
    let tenantId = request['tenantId']
    return this.offboardingTasksTemplateService.findAll(paginationOptions, tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<OffboardingTasksTemplate> {
    return this.offboardingTasksTemplateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOffboardingTasksTemplateDto: UpdateOffboardingTasksTemplateDto,
  ): Promise<any> {
    return this.offboardingTasksTemplateService.update(id, updateOffboardingTasksTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.offboardingTasksTemplateService.remove(id);
  }
}
