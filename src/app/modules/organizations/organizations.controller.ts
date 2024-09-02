import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Organization } from './entities/organization.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('organizations')
@ApiTags('Organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  async createOrganiztion(
    @Req() req: Request,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const tenantId = req['tenantId'];
    return await this.organizationsService.createOrganiztion(
      createOrganizationDto,
      tenantId,
    );
  }
  @Get()
  async findAllOrganizations(
    @Req() req: Request,
    @Query()
    paginationOptions?: PaginationDto,
  ): Promise<Pagination<Organization>> {
    const tenantId = req['tenantId'];
    return await this.organizationsService.findAllOrganizations(
      paginationOptions,
      tenantId,
    );
  }

  @Get(':id')
  async findOneOrganization(@Param('id') id: string): Promise<Organization> {
    return await this.organizationsService.findOneOrganization(id);
  }

  @Patch(':id')
  async updateOrganization(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const tenantId = req['tenantId'];
    return await this.organizationsService.updateOrganization(
      tenantId,
      id,
      updateOrganizationDto,
    );
  }

  @Delete(':id')
  async removeOrganization(@Param('id') id: string): Promise<Organization> {
    return await this.organizationsService.removeOrganization(id);
  }
}
