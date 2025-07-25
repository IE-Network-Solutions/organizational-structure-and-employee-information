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
import { UpdateEmployeeInformationFormDto } from './dto/update-employee-information-form.dto';

@Injectable()
export class EmployeeInformationFormService {
  constructor(
    @InjectRepository(EmployeeInformationForm)
    private employeeInformationFormRepository: Repository<EmployeeInformationForm>,
    private readonly paginationService: PaginationService, // private readonly userPermissionService: UserPermissionService,
  ) {}

  async create(
    createEmployeeInformationFormDto: CreateEmployeeInformationFormDto,
    tenantId: string,
  ) {
    const existingForm = await this.getEmployeeFormByFormTitle(
      createEmployeeInformationFormDto.formTitle,
    );

    if (existingForm) {
      await this.employeeInformationFormRepository.update(
        { id: existingForm.id },
        { form: createEmployeeInformationFormDto.form, tenantId },
      );

      return await this.findOne(existingForm.id);
    }

    const newForm = this.employeeInformationFormRepository.create({
      formTitle: createEmployeeInformationFormDto.formTitle,
      form: createEmployeeInformationFormDto.form,
      tenantId,
    });

    return await this.employeeInformationFormRepository.save(newForm);
  }

  async findAll(
    tenantId: string,
    paginationOptions: PaginationDto,
  ): Promise<Pagination<EmployeeInformationForm>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions?.page || 1, // Default to page 1 if not provided
        limit: paginationOptions?.limit || 0, // 0 means fetch all records
      };
      const queryBuilder = await this.employeeInformationFormRepository
        .createQueryBuilder('employee_information_form')
        .where('employee_information_form.tenantId = :tenantId', { tenantId });
      return await this.paginationService.paginate<EmployeeInformationForm>(
        queryBuilder,
        options,
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`employeeInformationForm not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const employeejobinformation =
        await this.employeeInformationFormRepository
          .createQueryBuilder('employee-job-information')
          .where('employee-job-information.id = :id', { id })
          .getOne();

      return { ...employeejobinformation };
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `employeeInformationForm with id ${id} not found.`,
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

  async update(
    id: string,
    updateEmployeeJobInformationDto: UpdateEmployeeInformationFormDto,
  ) {
    try {
      await this.findOne(id);
      await this.employeeInformationFormRepository.update(
        { id },
        updateEmployeeJobInformationDto,
      );
      return await this.findOne(id);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `employeeInformationForm with id ${id} not found.`,
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.employeeInformationFormRepository.softDelete({ id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `employeeInformationForm with id ${id} not found.`,
        );
      }
      throw error;
    }
  }

  async getEmployeeFormByFormTitle(
    formTitle: string,
  ): Promise<EmployeeInformationForm | undefined> {
    return await this.employeeInformationFormRepository.findOne({
      where: { formTitle },
    });
  }
}
