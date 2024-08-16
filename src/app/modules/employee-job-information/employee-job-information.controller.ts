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
import { EmployeeJobInformationService } from './employee-job-information.service';
import { CreateEmployeeJobInformationDto } from './dto/create-employee-job-information.dto';
import { UpdateEmployeeJobInformationDto } from './dto/update-employee-job-information.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EmployeeJobInformation } from './entities/employee-job-information.entity';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';

@Controller('EmployeeJobInformation')
@ApiTags('EmployeeJobInformation')
export class EmployeeJobInformationsController {
  constructor(
    private readonly employeeJobInformationService: EmployeeJobInformationService,
  ) { }

  @Post()
  create(
    @Body() createEmployeeJobInformationDto: CreateEmployeeJobInformationDto,
    @Req() request: Request,
  ) {
    return this.employeeJobInformationService.create(
      createEmployeeJobInformationDto,
      request['tenantId'],
    );
  }

  @Get()
  async findAll(
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<EmployeeJobInformation>> {
    return await this.employeeJobInformationService.findAll(paginationOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeJobInformationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeJobInformationDto: UpdateEmployeeJobInformationDto,
  ) {
    return this.employeeJobInformationService.update(
      id,
      updateEmployeeJobInformationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeJobInformationService.remove(id);
  }
}
