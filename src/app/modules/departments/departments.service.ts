import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { TreeRepository } from 'typeorm';
import { UserService } from '../users/services/user.service';
import { EmployeeJobInformationService } from '../employee-job-information/employee-job-information.service';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: TreeRepository<Department>,
    private userService: UserService,
    private employeeJobInformationService: EmployeeJobInformationService,
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
    try {
      const departments = await this.departmentRepository.find({
        where: {
          tenantId: tenantId,
        },
      });
      if (departments?.length > 0) {
        const departmentTrees = await Promise.all(
          departments.map((department) =>
            this.departmentRepository.findDescendantsTree(department),
          ),
        );
        return departmentTrees.filter((item) => item.level === 0)[0];
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  async findUserTree(tenantId: string): Promise<Department> {
    try {
      const departments = await this.departmentRepository.find({
        where: { tenantId: tenantId },

        relations: ['employeeJobInformation'],
      });
      if (departments?.length > 0) {
        const departmentTrees = await Promise.all(
          departments.map(async (department) => {
            const departmentTree =
              await this.departmentRepository.findDescendantsTree(department, {
                relations: [
                  'employeeJobInformation',
                  'employeeJobInformation.user',
                  'employeeJobInformation.user.role',
                ],
              });
            departmentTree.employeeJobInformation =
              departmentTree.employeeJobInformation.filter(
                (info) => info.departmentLeadOrNot === true,
              );
            return departmentTree;
          }),
        );

        return departmentTrees.filter((item) => item.level === 0)[0];
      } else {
        throw new NotFoundException('No Department Was Created.');
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
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
    const department = await this.findOneDepartment(id);
    const descendants = await this.departmentRepository.findDescendants(
      department,
    );

    if (!department) {
      throw new NotFoundException(`Department with Id ${id} not found`);
    }

    if (descendants?.length > 0) {
      for (const dep of descendants) {
        await this.departmentRepository.softRemove(dep);
      }
    }
    await this.departmentRepository.softRemove(department);

    return department;
  }

  async removeDepartmentWithShift(
    departmentTobeDeletedId: string,
    departmentTobeShiftedId: string,
    tenantId: string
  ): Promise<Department> {
    const department = await this.findOneDepartment(departmentTobeDeletedId);
  
    if (!department) {
      throw new NotFoundException(`Department with Id ${departmentTobeDeletedId} not found`);
    }

    const users = await this.userService.findAllUsersByDepartment(
      tenantId,
      departmentTobeDeletedId
    );
  
    if (users && users.length > 0) {
      for (const user of users) {
        await this.employeeJobInformationService.update(user.employeeJobInformation[0].id, {departmentId: departmentTobeShiftedId});
      }
    }

    const descendants = await this.departmentRepository.findDescendants(department);

    if (descendants?.length > 0) {
      for (const dep of descendants) {
        if (dep.id !== departmentTobeDeletedId) {
          const descendantUsers = await this.userService.findAllUsersByDepartment(
            tenantId,
            dep.id
          );
    
          if (descendantUsers && descendantUsers.length > 0) {
            for (const user of descendantUsers) {
              await this.employeeJobInformationService.update(user.employeeJobInformation[0].id, {departmentId: departmentTobeShiftedId});
            }
          }

          await this.departmentRepository.softRemove(dep);
        }
      }
    }

    await this.departmentRepository.softRemove(department);
  
    return department;
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

  async updateDepartmentToMerge(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
    tenantId: string,
    level?: number,
  ): Promise<Department> {
    try {
      await this.departmentRepository.save(updateDepartmentDto);

      if (
        updateDepartmentDto.department &&
        updateDepartmentDto.department.length > 0
      ) {
        for (const dep of updateDepartmentDto.department) {
          await this.updateDepartmentToMerge(
            dep.id,
            dep,
            tenantId,
            updateDepartmentDto['level'] + 1,
          );
        }
      }
      return await this.findOneDepartment(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error);
      } else {
        throw new BadRequestException(error);
      }
    }
  }

  // async saveDepartmentTrees(createDepartmentDto: CreateDepartmentDto[]): Promise<void> {
  //   for (const dep of createDepartmentDto) {
  //     await this.createDepartment(dep);
  //   }
  // }
}
