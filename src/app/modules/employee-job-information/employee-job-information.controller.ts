// import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
    private readonly EmployeeJobInformationService: EmployeeJobInformationService,
  ) { }

  @Post()
  create(
    @Body() CreateEmployeeJobInformationDto: CreateEmployeeJobInformationDto, tenantId: string
  ) {
    return this.EmployeeJobInformationService.create(
      CreateEmployeeJobInformationDto,
      tenantId
    );
  }

  @Get()
  async findAll(
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<EmployeeJobInformation>> {
    return await this.EmployeeJobInformationService.findAll(paginationOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.EmployeeJobInformationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() UpdateEmployeeJobInformationDto: UpdateEmployeeJobInformationDto,
  ) {
    return this.EmployeeJobInformationService.update(
      id,
      UpdateEmployeeJobInformationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.EmployeeJobInformationService.remove(id);
  }
}
