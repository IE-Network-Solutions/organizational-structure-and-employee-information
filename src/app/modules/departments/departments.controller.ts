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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags } from '@nestjs/swagger';

@Controller('departments')
@ApiTags('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) { }

  @Post()
  async createDepartment(
    @Req() req: Request,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    const tenantId = req['tenantId'];
    return await this.departmentsService.createDepartment(
      createDepartmentDto,
      tenantId,
    );
  }

  @Get()
  async findAllDepartments(@Req() req: Request) {
    const tenantId = req['tenantId'];
    return await this.departmentsService.findAllDepartments(tenantId);
  }

  @Get(':id')
  async findOneDepartment(@Param('id') id: string): Promise<Department> {
    return await this.departmentsService.findOneDepartment(id);
  }

  @Patch(':id')
  async updateDepartment(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const tenantId = req['tenantId'];
    return await this.departmentsService.updateDepartment(
      id,
      updateDepartmentDto,
      tenantId,
    );
  }

  @Delete(':id')
  async removeDepartment(@Param('id') id: string): Promise<Department> {
    return await this.departmentsService.removeDepartment(id);
  }
  @Get('/tenant/departments')
  async findAllDepartmentsByTenantId(
    @Req() req: Request,
  ): Promise<Department[]> {
    const tenantId = req['tenantId'];
    return await this.departmentsService.findAllDepartmentsByTenantId(tenantId);
  }
}
