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

@Injectable()
export class EmployeeInformationFormService {
  constructor(
    @InjectRepository(EmployeeInformationForm)
    private employeeInformationFormRepository: Repository<EmployeeInformationForm>,
    private readonly paginationService: PaginationService, // private readonly userPermissionService: UserPermissionService,
  ) { }

  async create(createEmployeeInformationFormDto: CreateEmployeeInformationFormDto, tenantId: string) {
    // Retrieve the existing form by title
    const existingForm = await this.getEmployeeFormByFormTitle(createEmployeeInformationFormDto.formTitle);

    if (existingForm) {
      const existingFormFields = existingForm.form || [];
      const newFormFields = createEmployeeInformationFormDto.form || [];

      // Assuming the fields are objects with `id` and other properties
      const mergedFormFields = [
        ...existingFormFields,
        ...newFormFields,
      ];

      // Remove duplicates based on ID if needed
      const uniqueMergedFields = mergedFormFields.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      existingForm.form = uniqueMergedFields;

      // Save the merged form
      try {
        return await this.employeeInformationFormRepository.save(existingForm);
      } catch (error) {
        throw new ConflictException(error.message);
      }
    } else {
      // Directly use form fields provided from the front-end
      const formFields = createEmployeeInformationFormDto.form?.map((formField) => ({
        ...formField,
      }));

      // Create a new form entry
      const employeeInformationForm = this.employeeInformationFormRepository.create({
        ...createEmployeeInformationFormDto,
        form: formFields,
        tenantId,
      });

      try {
        return await this.employeeInformationFormRepository.save(employeeInformationForm);
      } catch (error) {
        throw new ConflictException(error.message);
      }
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

  async getEmployeeFormByFormTitle(formTitle: string): Promise<EmployeeInformationForm | undefined> {
    return await this.employeeInformationFormRepository.findOne({ where: { formTitle } });
  }
}
