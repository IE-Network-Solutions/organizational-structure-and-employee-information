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
import { CreateEmployeeInformationDto } from './dto/create-employee-information.dto';
import { UpdateEmployeeInformationDto } from './dto/update-employee-information.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EmployeeInformation } from './entities/employee-information.entity';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { EmployeeInformationService } from './employee-information.service';
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import { ExcludeAuthGuard } from '@root/src/core/guards/exclud.guard';

@Controller('employee-information')
@ApiTags('Employee Information')
export class EmployeeInformationController {
  constructor(
    private readonly employeeInformationService: EmployeeInformationService,
  ) {}

  @Post()
  create(
    @Body() createEmployeeInformationDto: CreateEmployeeInformationDto,
    tenantId: string,
  ) {
    return this.employeeInformationService.create(
      createEmployeeInformationDto,
      tenantId,
    );
  }

  @Get()
  async findAll(
    @Req() request: Request,
    @Query() paginationOptions?: PaginationDto,
    @Query() searchFilterDTO?: SearchFilterDTO,
  ): Promise<Pagination<EmployeeInformation>> {
    return await this.employeeInformationService.findAll(
      paginationOptions,
      searchFilterDTO,
      request['tenantId'],
    );
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
  @Get('/users/birth-day')
  getEmployeeBirthDay(@Req() request: Request) {
    const tenantId = request['tenantId'];
    return this.employeeInformationService.getEmployeeBirthDay(tenantId);
  }
  @Get('/users/anniversary')
  getEmployeeAnniversary(@Req() request: Request) {
    const tenantId = request['tenantId'];
    return this.employeeInformationService.getEmployeeAnniversary(tenantId);
  }
  @Get('/users/employee/:employeeId')
  @ExcludeAuthGuard()
  employeeInformationByEmployeeId(@Req() request: Request, @Param('employeeId') employeeId: string,) {
    const tenantId = request['tenantId'];
    return this.employeeInformationService.employeeInformationByEmployeeId(tenantId,employeeId);
  }
}
