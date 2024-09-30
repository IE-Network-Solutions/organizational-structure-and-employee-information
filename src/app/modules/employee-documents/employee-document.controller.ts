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
  UploadedFiles,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { UpdateEmployeeDocumentDto } from './dto/update-employee-documents.dto';
import { EmployeeDocument } from './entities/employee-documents.entity';
import { EmployeeDocumentService } from './employee-document.service';
import { CreateEmployeeDocumentDto } from './dto/create-employee-documents.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
@Controller('employee-document')
@ApiTags('Employee Document')
export class EmployeeDocumentController {
  constructor(
    private readonly employeeDocumentService: EmployeeDocumentService,
  ) { }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Req() request: Request,
    @Body() createEmployeeDocumentsDto: CreateEmployeeDocumentDto,
    @UploadedFiles() documentName: Express.Multer.File[],
  ): Promise<EmployeeDocument[]> {
    if (documentName?.length > 0) {
      const documents = await Promise.all(
        documentName.map(async (docName) => {
          return await this.employeeDocumentService.create(
            createEmployeeDocumentsDto,
            docName,
            request['tenantId'],
          );
        }),
      );

      return documents;
    }
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
