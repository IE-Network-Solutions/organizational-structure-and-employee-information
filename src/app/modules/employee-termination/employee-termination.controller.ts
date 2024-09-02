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
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { EmployeeTermination } from './entities/employee-termination.entity';
import { CreateEmployeeTerminationDto } from './dto/create-employee-termination.dto';
import { UpdateEmployeeTerminationDto } from './dto/update-employee-termination.dto';
import { EmployeeTerminationService } from './employee-termination.service';
import { CreateEmployeeJobInformationDto } from '../employee-job-information/dto/create-employee-job-information.dto';
@Controller('employee-termination')
@ApiTags('employeeTermination')
@ApiHeader({
  name: 'tenantId',
  description: 'Custom header',
  required: true,
})
export class EmployeeTerminationController {
  constructor(
    private readonly employeeTerminationService: EmployeeTerminationService,
  ) { }
  @Post()
  async createEmployeeTermination(
    @Req() req: Request,
    @Body() createEmployeeTerminationDto: CreateEmployeeTerminationDto,
  ): Promise<EmployeeTermination> {
    const tenantId = req['tenantId'];
    return await this.employeeTerminationService.create(
      createEmployeeTerminationDto,
      tenantId,
    );
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<EmployeeTermination>> {
    const tenantId = req['tenantId'];
    return await this.employeeTerminationService.findAll(
      tenantId,
      paginationOptions,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EmployeeTermination> {
    return await this.employeeTerminationService.findOne(id);
  }

  @Get('/users/:userId')
  async findOneByUserIdWithJobInfo(@Param('userId') userId: string): Promise<EmployeeTermination> {
    return await this.employeeTerminationService.findOneByUserIdWithJobInfo(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeTerminationDto: UpdateEmployeeTerminationDto,
  ): Promise<EmployeeTermination> {
    return this.employeeTerminationService.update(
      id,
      updateEmployeeTerminationDto,
    );
  }

  @Delete(':id')
  async removeEmployeeTermination(
    @Param('id') id: string,
  ): Promise<EmployeeTermination> {
    return await this.employeeTerminationService.remove(id);
  }


  @Patch('/rehireUser/:userId')
  async rehireUser(@Req() request: Request, @Param('userId') userId: string, @Body() createEmployeeJobInformationDto: CreateEmployeeJobInformationDto): Promise<any> {
    const tenantId = request['tenantId'];
    return await this.employeeTerminationService.rehireUser(userId, tenantId, createEmployeeJobInformationDto);
  }
}
