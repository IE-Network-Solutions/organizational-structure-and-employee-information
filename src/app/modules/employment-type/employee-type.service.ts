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
import { CreateEmployeeTypeDto } from './dto/create-employee-type.dto';
import { EmployeeType } from './entities/employee-type.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { checkIfDataExists } from '@root/src/core/utils/checkIfDataExists.util';
import { UpdateEmployeeTypeDto } from './dto/update-employee-type.dto';

@Injectable()
export class EmployeeTypeService {
  constructor(
    @InjectRepository(EmployeeType)
    private EmployeeTypeRepository: Repository<EmployeeType>,
    private readonly paginationService: PaginationService, // private readonly userPermissionService: UserPermissionService,
  ) {}

  async create(CreateEmployeeTypeDto: CreateEmployeeTypeDto) {
    const employeeType = this.EmployeeTypeRepository.create(
      CreateEmployeeTypeDto,
    );
    try {
      return await this.EmployeeTypeRepository.save(employeeType);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findAll(
    paginationOptions: PaginationDto,
  ): Promise<Pagination<EmployeeType>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = await this.EmployeeTypeRepository.createQueryBuilder(
        'EmployeeType',
      ).orderBy('EmployeeType.createdAt', 'DESC');

      return await this.paginationService.paginate<EmployeeType>(
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
      const EmployeeType = await this.EmployeeTypeRepository.createQueryBuilder(
        'EmployeeType',
      )
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

  async update(id: string, UpdateEmployeeTypeDto: UpdateEmployeeTypeDto) {
    try {
      await this.EmployeeTypeRepository.findOneOrFail({ where: { id: id } });
      await this.EmployeeTypeRepository.update({ id }, UpdateEmployeeTypeDto);
      return await this.EmployeeTypeRepository.findOneOrFail({
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
      await this.EmployeeTypeRepository.findOneOrFail({ where: { id: id } });
      return await this.EmployeeTypeRepository.softDelete({ id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`EmployeeType with id ${id} not found.`);
      }
      throw error;
    }
  }
}
