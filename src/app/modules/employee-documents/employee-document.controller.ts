import { documentUploadOptions } from './../../../core/utils/upload-file.utils';
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
  Req,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { UpdateEmployeeDocumentDto } from './dto/update-employee-documents.dto';
import { EmployeeDocument } from './entities/employee-documents.entity';
import { EmployeeDocumentService } from './employee-document.service';
import { CreateEmployeeDocumentDto } from './dto/create-employee-documents.dto';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('employee-document')
@ApiTags('Employee Document')
export class EmployeeDocumentController {
  constructor(
    private readonly employeeDocumentService: EmployeeDocumentService,
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('documentName', documentUploadOptions))
  async create(
    @Req() request: Request,
    @Body() createEmployeeDocumentsDto: CreateEmployeeDocumentDto, @UploadedFile() documentName: Express.Multer.File) {
    return this.employeeDocumentService.create(
      createEmployeeDocumentsDto,
      documentName,
      request['tenantId']
    );
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
    @Body() updateEmployeeDocumentsDto: UpdateEmployeeDocumentDto,
  ) {
    return this.employeeDocumentService.update(id, updateEmployeeDocumentsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeDocumentService.remove(id);
  }
}
