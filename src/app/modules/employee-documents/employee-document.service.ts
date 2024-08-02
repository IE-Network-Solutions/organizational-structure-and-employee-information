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
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { CreateEmployeeJobInformationDto } from '../employee-job-information/dto/create-employee-job-information.dto';
import { UpdateEmployeeDocumentsDto } from './dto/update-employee-documents.dto';
import { EmployeeDocument } from './entities/employee-documents.entity';
import { CreateEmployeeDocumentsDto } from './dto/create-employee-documents.dto';

@Injectable()
export class EmployeeDocumentService {
  constructor(
    @InjectRepository(EmployeeDocument)
    private employeejobinformationRepository: Repository<EmployeeDocument>,
    private readonly paginationService: PaginationService, // private readonly userPermissionService: UserPermissionService,
  ) { }

  async create(
    createEmployeeDocumentsDto: CreateEmployeeDocumentsDto,
  ) {
    const user = this.employeejobinformationRepository.create(createEmployeeDocumentsDto);
    try {
      return await this.employeejobinformationRepository.save(user);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findAll(
    paginationOptions: PaginationDto,
  ): Promise<Pagination<EmployeeDocument>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = await this.employeejobinformationRepository
        .createQueryBuilder('employee-documents')
        .orderBy('employee-documents.createdAt', 'DESC');

      return await this.paginationService.paginate<EmployeeDocument>(
        queryBuilder,
        options,
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`EmployeeDocument not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const employeejobinformation = await this.employeejobinformationRepository
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

  async update(
    id: string,
    updateEmployeeDocumentsDto: UpdateEmployeeDocumentsDto,
  ) {
    try {
      await this.employeejobinformationRepository.findOneOrFail({
        where: { id: id },
      });
      // await this.employeejobinformationRepository.update(
      //   { id },
      //   updateEmployeeJobInformationDto,
      // );
      return await this.employeejobinformationRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `EmployeeJobInformation with id ${id} not found.`,
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.employeejobinformationRepository.findOneOrFail({
        where: { id: id },
      });
      return await this.employeejobinformationRepository.softDelete({ id });
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
