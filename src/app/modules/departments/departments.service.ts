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
import { level } from 'winston';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: TreeRepository<Department>,
    private paginationService: PaginationService,
  ) {}
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
    tenantId: string,
    parentDepartment?: Department,
    level = 0,
  ): Promise<Department> {
    try {
      const department = await this.departmentRepository.findOne({
        where: { name: createDepartmentDto.name, tenantId: tenantId },
      });
      if (department) {
        throw new NotFoundException(
          `Department with Name ${department.name} Already exist`,
        );
      }
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
      return await this.findAllDepartments(tenantId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findAllDepartments(tenantId: string): Promise<Department> {
    const departments = await this.departmentRepository.findTrees();
    return departments[0];
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

  async findAllDepartmentsByTenantId(tenantId: string): Promise<Department[]> {
    try {
      return await this.departmentRepository.find({
        where: { tenantId: tenantId },
      });
    } catch (error) {
      throw new NotFoundException(`Department  not found`);
    }
  }
  // async updateDepartment(
  //   id: string,
  //   updateDepartmentDto: UpdateDepartmentDto,
  //   tenantId: string,
  //   parentDepartment?: Department,

  //   level?: number,
  // ): Promise<Department> {
  //   try {
  //     // if (id = '') {
  //     //   console.log("id", "klklk")
  //     //   const level = parentDepartment.level + 1
  //     //   await this.createDepartment(
  //     //     updateDepartmentDto,
  //     //     tenantId,
  //     //     parentDepartment,
  //     //     level,
  //     //   )
  //     // }
  //     const department = await this.findOneDepartment(id);
  //     console.log(department, "l")
  //     if (department && !parentDepartment) {
  //       console.log("ceo")
  //       if (department.level !== 0) {
  //         const parent = await this.departmentRepository.findAncestorsTree(
  //           department,
  //         );
  //         parentDepartment = parent.parent
  //       }
  //     }
  //     console.log("anbesa", parentDepartment, level)
  //     // if (!department) {
  //     //   const level = parentDepartment.level + 1
  //     //   await this.createDepartment(
  //     //     updateDepartmentDto,
  //     //     tenantId,
  //     //     parentDepartment,
  //     //     level,
  //     //   )
  //     //   // throw new NotFoundException(`Department with Id ${id} not found`);
  //     // }

  //     department.name = updateDepartmentDto.name;
  //     department.branchId = updateDepartmentDto.branchId;
  //     department.description = updateDepartmentDto.description;
  //     department.parent = parentDepartment || null;
  //     department.level = level || parentDepartment.level + 1 || 0;
  //     console.log(department, "depeeeeeeerrrrrdepeeeeeeerrrrr")
  //     await this.departmentRepository.save(department);
  //     if (
  //       updateDepartmentDto.department &&
  //       updateDepartmentDto.department.length > 0
  //     ) {
  //       console.log("iam hindu")
  //       for (const dep of updateDepartmentDto.department) {
  //         console.log(department.level, "iam hindu")
  //         await this.updateDepartment(dep.id, dep, tenantId, department, department.level + 1);
  //       }
  //     }
  //     return await this.findOneDepartment(id);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       console.log(parentDepartment, "op")
  //       const level = parentDepartment.level + 1
  //       console.log(level, "op")
  //       await this.createDepartment(
  //         updateDepartmentDto,
  //         tenantId,
  //         parentDepartment,
  //         level,
  //       )
  //     }
  //     else {
  //       throw new BadRequestException(error);
  //     }
  //   }
  // }

  async updateDepartment(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
    tenantId: string,
    parentDepartment?: Department,
    level?: number,
  ): Promise<Department> {
    try {
      const department = await this.findOneDepartment(id);

      if (department && !parentDepartment) {
        if (department.level !== 0) {
          const parent = await this.departmentRepository.findAncestorsTree(
            department,
          );
          parentDepartment = parent.parent;
        }
      }
      department.name = updateDepartmentDto.name;
      department.branchId = updateDepartmentDto.branchId;
      department.description = updateDepartmentDto.description;
      department.parent = parentDepartment || null;
      department.level =
        level ?? (parentDepartment ? parentDepartment.level + 1 : 0);

      await this.departmentRepository.save(department);

      if (
        updateDepartmentDto.department &&
        updateDepartmentDto.department.length > 0
      ) {
        for (const dep of updateDepartmentDto.department) {
          await this.updateDepartment(
            dep.id,
            dep,
            tenantId,
            department,
            department.level + 1,
          );
        }
      }

      return await this.findOneDepartment(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        const newLevel = parentDepartment ? parentDepartment.level + 1 : 0;

        return await this.createDepartment(
          updateDepartmentDto,
          tenantId,
          parentDepartment,
          newLevel,
        );
      } else {
        throw new BadRequestException(error);
      }
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

  async findAncestor(id: string) {
    try {
      const department = await this.departmentRepository.findOneByOrFail({
        id,
      });
      const ancestors = await this.departmentRepository.findAncestorsTree(
        department,
      );
      return ancestors.parent;
    } catch (error) {
      throw new NotFoundException(`Department not found`);
    }
  }

  // async saveDepartmentTrees(createDepartmentDto: CreateDepartmentDto[]): Promise<void> {
  //   for (const dep of createDepartmentDto) {
  //     await this.createDepartment(dep);
  //   }
  // }
}
