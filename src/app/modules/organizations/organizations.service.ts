import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { checkIfDataExists } from '@root/src/core/utils/checkIfDataExists.util';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private paginationService: PaginationService,
  ) {}
  async createOrganiztion(
    createOrganizationDto: CreateOrganizationDto,
    tenantId: string,
  ): Promise<Organization> {
    try {
      const organizationExists = await this.organizationRepository.findOne({
        where: { tenantId: tenantId },
      });
      if (!organizationExists) {
        const createOrganization = this.organizationRepository.create({
          ...createOrganizationDto,
          tenantId: tenantId,
        });
        return await this.organizationRepository.save(createOrganization);
      }
      return await this.updateOrganization(
        tenantId,
        organizationExists.id,
        createOrganizationDto,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllOrganizations(
    paginationOptions: PaginationDto,
    tenantId: string,
  ): Promise<Pagination<Organization>> {
    const options: IPaginationOptions = {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };

    const paginatedData = await this.paginationService.paginate<Organization>(
      this.organizationRepository,
      'p',
      options,
      paginationOptions.orderBy,
      paginationOptions.orderDirection,
      { tenantId },
    );

    return paginatedData;
  }

  async findOneOrganization(id: string): Promise<Organization> {
    try {
      const organization = await this.organizationRepository.findOneByOrFail({
        id,
      });
      return organization;
    } catch (error) {
      throw new NotFoundException(`organization with Id ${id} not found`);
    }
  }

  async updateOrganization(
    tenantId: string,
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.findOneOrganization(id);
    if (!organization) {
      throw new NotFoundException(`organization with Id ${id} not found`);
    }

    const updatedOrganization = await this.organizationRepository.update(id, {
      ...updateOrganizationDto,
      tenantId: tenantId,
    });
    return await this.findOneOrganization(id);
  }

  async removeOrganization(id: string): Promise<Organization> {
    const organization = await this.findOneOrganization(id);
    if (!organization) {
      throw new NotFoundException(`Client with Id ${id} not found`);
    }
    await this.organizationRepository.softDelete(id);
    return organization;
  }
}
