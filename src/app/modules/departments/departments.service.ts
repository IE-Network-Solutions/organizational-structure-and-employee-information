import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { Department } from './entities/department.entity';
import { Repository, TreeRepository } from 'typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: TreeRepository<Department>,
    private paginationService: PaginationService,
  ) { }
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
    tenantId: string,
    parentDepartment?: Department,
    level = 0,
  ): Promise<Department> {
    try {
      const newDepartment = new Department();
      newDepartment.name = createDepartmentDto.name;
      newDepartment.description = createDepartmentDto.description;
      (newDepartment.branchId = createDepartmentDto.branchId),
        (newDepartment.tenantId = tenantId);
      newDepartment.level = level;
      if (parentDepartment) {
        newDepartment.parent = parentDepartment;
      }

      await this.departmentRepository.save(newDepartment);

      if (
        createDepartmentDto.department &&
        createDepartmentDto.department.length > 0
      ) {
        for (const dep of createDepartmentDto.department) {
          await this.createDepartment(dep, tenantId, newDepartment, level + 1);
        }
      }
      return await this.findAllDepartments(tenantId)
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findAllDepartments(

    tenantId: string,
  ): Promise<Department> {

    const departments = await this.departmentRepository.findTrees();
    return departments[0]
  }

  async findOneDepartment(id: string): Promise<Department> {
    try {
      const department = await this.departmentRepository.findOneByOrFail({
        id,
      });

      return await this.departmentRepository.findDescendantsTree(department);
    } catch (error) {
      throw new NotFoundException(`Department with Id ${id} not found`);
    }
  }

  async updateDepartment(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
    parentDepartment?: Department,
    level = 0,
  ): Promise<Department> {
    try {
      const department = await this.findOneDepartment(id);
      if (!department) {
        throw new NotFoundException(`Department with Id ${id} not found`);
      }

      department.name = updateDepartmentDto.name;
      department.branchId = updateDepartmentDto.branchId;
      department.description = updateDepartmentDto.description;
      department.parent = parentDepartment || null;
      department.level = level;
      await this.departmentRepository.save(department);
      if (
        updateDepartmentDto.department &&
        updateDepartmentDto.department.length > 0
      ) {
        for (const dep of updateDepartmentDto.department) {
          await this.updateDepartment(dep.id, dep, department, level + 1);
        }
      }
      return await this.findOneDepartment(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async removeDepartment(id: string): Promise<Department> {
    const Department = await this.findOneDepartment(id);
    if (!Department) {
      throw new NotFoundException(`Department with Id ${id} not found`);
    }
    await this.departmentRepository.softDelete(id);
    return Department;
  }

  // async saveDepartmentTrees(createDepartmentDto: CreateDepartmentDto[]): Promise<void> {
  //   for (const dep of createDepartmentDto) {
  //     await this.createDepartment(dep);
  //   }
  // }
}
