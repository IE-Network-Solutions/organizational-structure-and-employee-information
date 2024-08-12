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
import { EmployementType } from './entities/employement-type.entity';
import { CreateEmployementTypeDto } from './dto/create-employement-type.dto';
import { UpdateEmployementTypeDto } from './dto/update-employement-type.dto';

@Injectable()
export class EmployementTypeService {
  constructor(
    @InjectRepository(EmployementType)
    private employeeTypeRepository: Repository<EmployementType>,
    private readonly paginationService: PaginationService, // private readonly userPermissionService: UserPermissionService,
  ) { }

  async create(
    createEmployementTypeDto: CreateEmployementTypeDto,
    tenantId: string,
  ) {
    const employeeType = this.employeeTypeRepository.create({
      ...createEmployementTypeDto,
      tenantId,
    });
    try {
      return await this.employeeTypeRepository.save(employeeType);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findAll(
    paginationOptions: PaginationDto,
  ): Promise<Pagination<EmployementType>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = await this.employeeTypeRepository
        .createQueryBuilder('EmploymentType')
        .orderBy('EmploymentType.createdAt', 'DESC');

      return await this.paginationService.paginate<EmployementType>(
        queryBuilder,
        options,
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`EmployeeType not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const EmployeeType = await this.employeeTypeRepository
        .createQueryBuilder('EmployeeType')
        .where('EmployeeType.id = :id', { id })
        .getOne();

      return { ...EmployeeType };
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`EmployeeType with id ${id} not found.`);
      }
      throw error;
    }
  }

  async update(id: string, updateEmployementTypeDto: UpdateEmployementTypeDto) {
    try {
      await this.employeeTypeRepository.findOneOrFail({ where: { id: id } });
      await this.employeeTypeRepository.update(
        { id },
        updateEmployementTypeDto,
      );
      return await this.employeeTypeRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`EmployeeType with id ${id} not found.`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.employeeTypeRepository.findOneOrFail({ where: { id: id } });
      return await this.employeeTypeRepository.softDelete({ id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`EmployeeType with id ${id} not found.`);
      }
      throw error;
    }
  }
}
