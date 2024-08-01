// import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { CreateEmployeeInformationFormDto } from './dto/create-employee-information-form.dto';
import { EmployeeInformationForm } from './entities/employee-information-form.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { checkIfDataExists } from '@root/src/core/utils/checkIfDataExists.util';
import { UpdateEmployeeInformationFormDto } from './dto/update-employee-information-form.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmployeeInformationFormService {
  constructor(
    @InjectRepository(EmployeeInformationForm)
    private employeeInformationFormRepository: Repository<EmployeeInformationForm>,
    private readonly paginationService: PaginationService, // private readonly userPermissionService: UserPermissionService,
  ) { }

  async create(createEmployeeInformationFormDto: CreateEmployeeInformationFormDto) {
    const formWithIds = createEmployeeInformationFormDto.form.map(formField => ({
      ...formField,
      id: uuidv4(),
    }));

    const employeeInformationForm = this.employeeInformationFormRepository.create({
      ...createEmployeeInformationFormDto,
      form: formWithIds,
    });

    try {
      return await this.employeeInformationFormRepository.save(employeeInformationForm);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findAll(
    paginationOptions: PaginationDto,
  ): Promise<Pagination<EmployeeInformationForm>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = await this.employeeInformationFormRepository
        .createQueryBuilder('employee-job-information')
        .orderBy('employee-job-information.createdAt', 'DESC');

      return await this.paginationService.paginate<EmployeeInformationForm>(
        queryBuilder,
        options,
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`EmployeeJobInformation not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const employeejobinformation = await this.employeeInformationFormRepository
        .createQueryBuilder('employee-job-information')
        .where('employee-job-information.id = :id', { id })
        .getOne();

      return { ...employeejobinformation };
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `EmployeeJobInformation with id ${id} not found.`,
        );
      }
      throw error;
    }
  }

  async findFormFieldsByTenantId(tenantId: string) {
    try {
      const forms = await this.employeeInformationFormRepository
        .createQueryBuilder('employeeInformationForm')
        .where('employeeInformationForm.tenantId = :tenantId', { tenantId })
        .getMany();

      if (forms.length === 0) {
        throw new NotFoundException(
          `No EmployeeInformationForms found for tenantId ${tenantId}.`,
        );
      }

      return forms;
    } catch (error) {
      throw error;
    }
  }



  // async update(
  //   id: string,
  //   updateEmployeeJobInformationDto: UpdateEmployeeInformationFormDto,
  // ) {
  //   try {
  //     await this.employeeinformationFormRepository.findOneOrFail({
  //       where: { id: id },
  //     });
  //     await this.employeeinformationFormRepository.update(
  //       { id },
  //       updateEmployeeJobInformationDto,
  //     );
  //     return await this.employeeinformationFormRepository.findOneOrFail({
  //       where: { id: id },
  //     });
  //   } catch (error) {
  //     if (error.name === 'EntityNotFoundError') {
  //       throw new NotFoundException(
  //         `EmployeeJobInformation with id ${id} not found.`,
  //       );
  //     }
  //     throw error;
  //   }
  // }

  async remove(id: string) {
    try {
      await this.employeeInformationFormRepository.findOneOrFail({
        where: { id: id },
      });
      return await this.employeeInformationFormRepository.softDelete({ id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `EmployeeJobInformation with id ${id} not found.`,
        );
      }
      throw error;
    }
  }
}
