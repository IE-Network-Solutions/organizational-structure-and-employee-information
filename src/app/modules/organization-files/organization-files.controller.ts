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

import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { OrganizationFilesService } from './organization-files.service';
import { OrganizationFile } from './entities/organization-file.entity';
import { CreateOrganizationFileDto } from './dto/create-organization-file.dto';
import { tenantId } from '../branchs/tests/branch.data';
import { UpdateOrganizationFileDto } from './dto/update-organization-file.dto';
@Controller('organization-files')
@ApiTags('Organization Files')
export class OrganizationFilesController {
  constructor(
    private readonly organizationFileService: OrganizationFilesService,
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Req() request: Request,
    @Body() createOrganizationFilesDto: CreateOrganizationFileDto,
    @UploadedFiles() documentName: Express.Multer.File[],
  ): Promise<OrganizationFile> {
    if (documentName?.length > 0) {
      const tenantId = request['tenantId'];

      return await this.organizationFileService.createOrganizationFile(
        createOrganizationFilesDto,
        documentName,
        tenantId,
      );
    }
  }
  @Get()
  async findAllOrganizationFiles(
    @Req() request: Request,
    @Query() paginationOptions?: PaginationDto,
  ): Promise<Pagination<OrganizationFile>> {
    const tenantId = request['tenantId'];
    return await this.organizationFileService.findAllOrganizationFiles(
      tenantId,
      paginationOptions,
    );
  }
  @Get(':id')
  findOneOrganizationFile(@Param('id') id: string) {
    return this.organizationFileService.findOneOrganizationFile(id);
  }
  @Patch(':id')
  updateOrganizationFile(
    @Param('id') id: string,
    @Body() updateOrganizationFilesDto: UpdateOrganizationFileDto,
  ) {
    return this.organizationFileService.updateOrganizationFile(
      id,
      updateOrganizationFilesDto,
    );
  }

  @Delete(':id')
  removeOrganizationFile(@Param('id') id: string) {
    return this.organizationFileService.removeOrganizationFile(id);
  }
}
