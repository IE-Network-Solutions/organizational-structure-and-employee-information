import { Repository } from 'typeorm';
import { DepartmentsService } from '../../departments/departments.service';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Department } from '../../departments/entities/department.entity';
import { UserService } from './user.service';
import { DissolveDepartmentDto } from '../../departments/dto/dissolve-department.dto';
import { UpdateEmployeeJobInformationDto } from '../../employee-job-information/dto/update-employee-job-information.dto';
import { EmployeeJobInformationService } from '../../employee-job-information/employee-job-information.service';

@Injectable()
export class UserDepartmentService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly departmentService: DepartmentsService,
    private readonly userService: UserService,
    private readonly employeeJobInformationService: EmployeeJobInformationService,
  ) {}

  async findAllDepartments(tenantId: string): Promise<Department[]> {
    try {
      const departments =
        await this.departmentService.findAllDepartmentsByTenantId(tenantId);
      if (departments?.length > 0) {
        for (const department of departments) {
          const users = await this.userService.findAllUsersByDepartment(
            tenantId,
            department.id,
          );
          department['users'] = users;
        }

        return departments;
      }
      return departments;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  async dissolveDepartment(
    dissolveDepartmentDto: DissolveDepartmentDto,
    tenantId: string,
  ): Promise<Department> {
    try {
      console.log("test automation")
      console.log("test automation")
      const departmentToDelete = dissolveDepartmentDto.departmentToDelete;
      delete dissolveDepartmentDto.departmentToDelete;
      const departments = await this.departmentService.updateDepartment(
        dissolveDepartmentDto.id,
        dissolveDepartmentDto,
        tenantId,
      );
      if (departments) {
        for (const department of departmentToDelete) {
          const departmentUsers = await this.userRepository.find({
            where: {
              employeeJobInformation: {
                departmentId: department,
                tenantId: tenantId,
              },
            },
            relations: ['employeeJobInformation'],
          });

          if (departmentUsers) {
            for (const user of departmentUsers) {
              for (const departmentUser of user.employeeJobInformation) {
                const updatedData = new UpdateEmployeeJobInformationDto();
                updatedData.departmentId = dissolveDepartmentDto.id;
                await this.employeeJobInformationService.update(
                  departmentUser.id,
                  updatedData,
                );
              }
            }
          }
        }
      }
      return departments;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  async mergeDepartment(
    dissolveDepartmentDto: DissolveDepartmentDto,
    tenantId: string,
  ): Promise<Department> {
    try {
      const departmentToDelete = dissolveDepartmentDto.departmentToDelete;
      delete dissolveDepartmentDto.departmentToDelete;
      const departments = await this.departmentService.updateDepartmentToMerge(
        dissolveDepartmentDto.id,
        dissolveDepartmentDto,
        tenantId,
      );
      if (departments) {
        for (const department of departmentToDelete) {
          const departmentUsers = await this.userRepository.find({
            where: {
              employeeJobInformation: {
                departmentId: department,
                tenantId: tenantId,
              },
            },
            relations: ['employeeJobInformation'],
          });
          if (departmentUsers) {
            for (const user of departmentUsers) {
              for (const departmentUser of user.employeeJobInformation) {
                const updatedData = new UpdateEmployeeJobInformationDto();
                updatedData.departmentId = dissolveDepartmentDto.id;
                await this.employeeJobInformationService.update(
                  departmentUser.id,
                  updatedData,
                );
              }
            }
          }
          await this.departmentService.removeDepartment(department);
        }
      }
      return departments;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }
}
