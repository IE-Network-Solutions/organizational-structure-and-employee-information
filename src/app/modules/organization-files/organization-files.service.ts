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
import { OrganizationFile } from './entities/organization-file.entity';
import { FileUploadService } from '@root/src/core/upload/upload.service';
import { CreateOrganizationFileDto } from './dto/create-organization-file.dto';
import { UpdateOrganizationFileDto } from './dto/update-organization-file.dto';

@Injectable()
export class OrganizationFilesService {
  constructor(
    @InjectRepository(OrganizationFile)
    private readonly employeeDocumentRepository: Repository<OrganizationFile>,
    private readonly paginationService: PaginationService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async createOrganizationFile(
    createOrganizationFilesDto: CreateOrganizationFileDto,
    documentName: Express.Multer.File[],
    tenantId: string,
  ): Promise<OrganizationFile> {
    try {
      const documents = await Promise.all(
        documentName.map(async (docName) => {
          const uploadedDocumentPath =
            await this.fileUploadService.uploadFileToServer(tenantId, docName);
          createOrganizationFilesDto.files.push(
            uploadedDocumentPath['viewImage'],
          );
        }),
      );

      const employeeDocument = this.employeeDocumentRepository.create({
        ...createOrganizationFilesDto,
        tenantId,
      });
      return await this.employeeDocumentRepository.save(employeeDocument);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findAllOrganizationFiles(
    tenantId: string,
    paginationOptions: PaginationDto,
  ): Promise<Pagination<OrganizationFile>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      return await this.paginationService.paginate<OrganizationFile>(
        this.employeeDocumentRepository,
        'OrganizationFile',
        options,
        paginationOptions.orderBy,
        paginationOptions.orderDirection,
        { tenantId },
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException('OrganizationFile not found.');
      }
      throw error;
    }
  }

  async findOneOrganizationFile(id: string) {
    try {
      return await this.employeeDocumentRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`OrganizationFile Not Found.`);
      }
      throw error;
    }
  }

  async updateOrganizationFile(
    id: string,
    updateOrganizationFilesDto: UpdateOrganizationFileDto,
  ) {
    try {
      await this.employeeDocumentRepository.findOneOrFail({ where: { id } });
      await this.employeeDocumentRepository.update(
        { id },
        updateOrganizationFilesDto,
      );
      return await this.employeeDocumentRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`OrganizationFile Not Found.`);
      }
      throw error;
    }
  }

  async removeOrganizationFile(id: string) {
    try {
      await this.employeeDocumentRepository.findOneOrFail({
        where: { id: id },
      });
      return await this.employeeDocumentRepository.softDelete({ id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`OrganizationFile Not Found.`);
      }
      throw error;
    }
  }
}
