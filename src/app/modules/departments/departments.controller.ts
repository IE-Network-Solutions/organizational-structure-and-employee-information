import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { ApiTags } from '@nestjs/swagger';
import { ExcludeAuthGuard } from '@root/src/core/guards/exclud.guard';

@Controller('departments')
@ApiTags('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

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

  @Get('child-departments/departments/:departmentId')
  async findAllChildDepartments(@Req() req: Request,@Param('departmentId') departmentId: string) {
    const tenantId = req['tenantId'];
    return await this.departmentsService.findAllChildDepartments(tenantId,departmentId);
  }


  @Get('child-departments/departments/all-levels/:departmentId')
  async findAllChildDepartmentsWithAllLevels(@Req() req: Request,@Param('departmentId') departmentId: string) {
    const tenantId = req['tenantId'];
    return await this.departmentsService.findAllChildDepartmentsWithAllLevels(tenantId,departmentId);
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

  @Delete(':departmentTobeDeletedId')
  async removeDepartment(
    @Req() req: Request,
    @Param('departmentTobeDeletedId') departmentTobeDeletedId: string,
    @Body('departmentTobeShiftedId') departmentTobeShiftedId: string,
  ): Promise<Department> {
    const tenantId = req['tenantId'];
    return await this.departmentsService.removeDepartmentWithShift(
      departmentTobeDeletedId,
      departmentTobeShiftedId,
      tenantId,
    );
  }

  @Get('/tenant/departments')
  @ExcludeAuthGuard()
  async findAllDepartmentsByTenantId(
    @Req() req: Request,
  ): Promise<Department[]> {
    const tenantId = req['tenantId'];
    return await this.departmentsService.findAllDepartmentsByTenantId(tenantId);
  }

  @Get('/user/user-tree')
  async findUserThree(@Req() req: Request): Promise<Department> {
    const tenantId = req['tenantId'];
    return await this.departmentsService.findUserTree(tenantId);
  }
}
