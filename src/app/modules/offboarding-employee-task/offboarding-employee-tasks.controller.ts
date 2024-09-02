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
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { CreateOffboardingEmployeeTaskDto } from './dto/create-offboarding-employee-task.dto';
import { UpdateOffboardingEmployeeTaskDto } from './dto/update-offboarding-employee-task.dto';
import { OffboardingEmployeeTaskService } from './offboarding-employee-task.service';

@Controller('offboarding-employee-tasks')
@ApiTags('Offboarding Employee Tasks')
export class OffboardingEmployeeTaskController {
  constructor(
    private readonly offboardingEmployeeTaskService: OffboardingEmployeeTaskService,
  ) { }

  @Post()
  create(
    @Req() request: Request,
    @Body() createOffboardingEmployeeTaskDto: CreateOffboardingEmployeeTaskDto[],
  ) {
    return this.offboardingEmployeeTaskService.create(
      request['tenantId'],
      createOffboardingEmployeeTaskDto
    );
  }

  @Get()
  findAll(
    @Query() paginationOptions?: PaginationDto,
  ) {
    return this.offboardingEmployeeTaskService.findAll(paginationOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offboardingEmployeeTaskService.findOne(id);
  }

  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateOffboardingEmployeeTaskDto: UpdateOffboardingEmployeeTaskDto,
  ) {
    const tenantId = request['tenantId'];
    return this.offboardingEmployeeTaskService.update(id, updateOffboardingEmployeeTaskDto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offboardingEmployeeTaskService.remove(id);
  }

  @Get('/termination/:id')
  findActiveTerminationTasks(@Req() request: Request, @Param('id') id: string) {
    const tenantId = request['tenantId'];
    return this.offboardingEmployeeTaskService.findActiveTerminationTasks(id, tenantId);
  }
}
