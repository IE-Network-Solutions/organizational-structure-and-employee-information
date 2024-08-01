// import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
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
    private readonly EmployeeInformationFormService: EmployeeInformationFormService,
  ) { }

  @Post()
  create(
    @Body() createEmployeeInformationFormDto: CreateEmployeeInformationFormDto,
  ) {
    return this.EmployeeInformationFormService.create(
      createEmployeeInformationFormDto,
    );
  }

  @Get()
  async findAll(
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<EmployeeInformationForm>> {
    return await this.EmployeeInformationFormService.findAll(paginationOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.EmployeeInformationFormService.findOne(id);
  }


  @Get('/tenant/:tenantId')
  findFormFieldsByTenantId(@Param('tenantId') tenantId: string) {
    return this.EmployeeInformationFormService.findFormFieldsByTenantId(tenantId);
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
    return this.EmployeeInformationFormService.remove(id);
  }
}
