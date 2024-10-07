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
  ) {}

  @Post()
  create(
    @Body() createEmployeeInformationFormDto: CreateEmployeeInformationFormDto,
    tenantId: string,
  ) {
    return this.employeeInformationFormService.create(
      createEmployeeInformationFormDto,
      tenantId,
    );
  }

  @Get()
  async findAll(
    @Req() request: Request,
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<EmployeeInformationForm>> {
    const tenantId = request['tenantId'];
    return await this.employeeInformationFormService.findAll(
      tenantId,
      paginationOptions,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeInformationFormService.findOne(id);
  }

  @Get('/tenant/:tenantId')
  findFormFieldsByTenantId(@Param('tenantId') tenantId: string) {
    return this.employeeInformationFormService.findFormFieldsByTenantId(
      tenantId,
    );
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() UpdateEmployeeJobInformationDto: UpdateEmployeeInformationFormDto,
  // ) {
  //   return this.employeeInformationFormService.update(
  //     id,
  //     UpdateEmployeeJobInformationDto,
  //   );
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeInformationFormService.remove(id);
  }
}
