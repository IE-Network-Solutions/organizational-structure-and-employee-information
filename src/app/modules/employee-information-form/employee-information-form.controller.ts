// import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { EmployeeInformationFormService } from './employee-information-form.service';
import { CreateEmployeeInformationFormDto } from './dto/create-employee-information-form.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EmployeeInformationForm } from './entities/employee-information-form.entity';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';

@Controller('employee-information-form')
@ApiTags('Employee Information Form')
export class EmployeeInformationFormsController {
  constructor(
    private readonly employeeInformationFormService: EmployeeInformationFormService,
  ) { }
  @Post()
  create(
    @Req() request: Request,
    @Body() createEmployeeInformationFormDto: CreateEmployeeInformationFormDto
  ) {
    return this.employeeInformationFormService.create(createEmployeeInformationFormDto, request['tenantId']);
  }

  @Get()
  async findAll(
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<EmployeeInformationForm>> {
    return await this.employeeInformationFormService.findAll(paginationOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeInformationFormService.findOne(id);
  }


  @Get('/tenant/find-form-fields-by-tenant-id')
  findFormFieldsByTenantId(@Req() request: Request) {
    return this.employeeInformationFormService.findFormFieldsByTenantId(request['tenantId']);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() UpdateEmployeeJobInformationDto: UpdateEmployeeInformationFormDto,
  // ) {
  //   return this.EmployeeInformationFormService.update(
  //     id,
  //     UpdateEmployeeJobInformationDto,
  //   );
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeInformationFormService.remove(id);
  }
}
