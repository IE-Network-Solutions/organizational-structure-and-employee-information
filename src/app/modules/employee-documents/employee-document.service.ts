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
import { EmployeeDocument } from './entities/employee-documents.entity';
import { CreateEmployeeDocumentDto } from './dto/create-employee-documents.dto';
import { FileUploadService } from '@root/src/core/upload/upload.service';
import { UpdateEmployeeDocumentDto } from './dto/update-employee-documents.dto';

@Injectable()
export class EmployeeDocumentService {
  constructor(
    @InjectRepository(EmployeeDocument)
    private readonly employeeDocumentRepository: Repository<EmployeeDocument>,
    private readonly paginationService: PaginationService,
    private readonly fileUploadService: FileUploadService,
  ) { }

  async create(
    createEmployeeDocumentsDto: CreateEmployeeDocumentDto, documentName: Express.Multer.File, tenantId: string
  ) {

    const uploadedDocumentPath = await this.fileUploadService.uploadFileToServer(tenantId, documentName);

    createEmployeeDocumentsDto['documentName'] = uploadedDocumentPath['viewImage'];

    createEmployeeDocumentsDto['documentLink'] = uploadedDocumentPath['image'];

    const employeeDocument = this.employeeDocumentRepository.create(createEmployeeDocumentsDto);
    try {
      return await this.employeeDocumentRepository.save(employeeDocument);
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

      const queryBuilder = this.employeeDocumentRepository
        .createQueryBuilder('employee_document')
        .orderBy('employee_document.createdAt', 'DESC');

      return await this.paginationService.paginate<EmployeeDocument>(
        queryBuilder,
        options,
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException('EmployeeDocument not found.');
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.employeeDocumentRepository
        .createQueryBuilder('employee_document')
        .where('employee_document.id = :id', { id })
        .getOne();
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
    updateEmployeeDocumentsDto: UpdateEmployeeDocumentDto,
  ) {
    try {
      await this.employeeDocumentRepository.findOneOrFail({ where: { id } });
      await this.employeeDocumentRepository.update(
        { id },
        updateEmployeeDocumentsDto,
      );
      return await this.employeeDocumentRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `EmployeeDocument with id ${id} not found.`,
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.employeeDocumentRepository.findOneOrFail({
        where: { id: id },
      });
      return await this.employeeDocumentRepository.softDelete({ id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `EmployeeDocument with id ${id} not found.`,
        );
      }
      throw error;
    }
  }
}
