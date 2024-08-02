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
import { CreateEmployeeInformationDto } from './dto/create-employee-information.dto';
import { UpdateEmployeeInformationDto } from './dto/update-employee-information.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EmployeeInformation } from './entities/employee-information.entity';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { EmployeeInformationService } from './employee-information.service';

@Controller('employee-information')
@ApiTags('Employee Information')
export class EmployeeInformationController {
  constructor(
    private readonly employeeInformationService: EmployeeInformationService,
  ) { }

  @Post()
  create(@Body() createEmployeeInformationDto: CreateEmployeeInformationDto, tenantId: string) {
    return this.employeeInformationService.create(createEmployeeInformationDto, tenantId);
  }

  @Get()
  async findAll(
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<EmployeeInformation>> {
    return await this.employeeInformationService.findAll(paginationOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeInformationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateEmployeeInformationDto,
  ) {
    return this.employeeInformationService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeInformationService.remove(id);
  }
}
