// import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { UpdateEmployeeDocumentsDto } from './dto/update-employee-documents.dto';
import { EmployeeDocument } from './entities/employee-documents.entity';
import { EmployeeDocumentService } from './employee-document.service';
import { CreateEmployeeDocumentsDto } from './dto/create-employee-documents.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { documentUploadOptions } from '@root/src/core/utils/upload-file.utils';
import { join } from 'path';

@Controller('employee-document')
@ApiTags('Employee Document')
export class EmployeeDocumentController {
  constructor(
    private readonly employeeDocumentService: EmployeeDocumentService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('documentLink', documentUploadOptions))
  async create(
    @Body() createEmployeeDocumentsDto: CreateEmployeeDocumentsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // const uploadedFilePath = await this.fileUploadService.uploadFileToServer(createEmployeeDocumentsDto.tenantId, file);
    // createEmployeeDocumentsDto.documentLink = uploadedFilePath['viewImage']
    // createEmployeeDocumentsDto.profileImageDownload = uploadedFilePath['image']
    return this.employeeDocumentService.create(createEmployeeDocumentsDto);
  }

  @Get()
  async findAll(
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<EmployeeDocument>> {
    return await this.employeeDocumentService.findAll(paginationOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeDocumentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDocumentsDto: UpdateEmployeeDocumentsDto,
  ) {
    return this.employeeDocumentService.update(id, updateEmployeeDocumentsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeDocumentService.remove(id);
  }
}
