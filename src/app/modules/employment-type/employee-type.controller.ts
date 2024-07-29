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
import { EmployeeTypeService } from './employee-type.service';
import { CreateEmployeeTypeDto } from './dto/create-employee-type.dto';
import { UpdateEmployeeTypeDto } from './dto/update-employee-type.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EmployeeType } from './entities/employee-type.entity';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';

@Controller('employee-type')
@ApiTags('Employee Type')
export class EmployeeTypesController {
  constructor(private readonly EmployeeTypeService: EmployeeTypeService) {}

  @Post()
  create(@Body() CreateEmployeeTypeDto: CreateEmployeeTypeDto) {
    return this.EmployeeTypeService.create(CreateEmployeeTypeDto);
  }

  @Get()
  async findAll(
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<EmployeeType>> {
    return await this.EmployeeTypeService.findAll(paginationOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.EmployeeTypeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeTypeDto: UpdateEmployeeTypeDto,
  ) {
    return this.EmployeeTypeService.update(id, updateEmployeeTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.EmployeeTypeService.remove(id);
  }
}
