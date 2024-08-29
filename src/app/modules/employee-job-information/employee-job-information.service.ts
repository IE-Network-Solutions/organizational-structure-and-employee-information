import { Nationality } from './../nationality/entities/nationality.entity';
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
import { CreateEmployeeJobInformationDto } from './dto/create-employee-job-information.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { UpdateEmployeeJobInformationDto } from './dto/update-employee-job-information.dto';
import { EmployeeJobInformation } from './entities/employee-job-information.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EmployeeJobInformationService {
  constructor(
    @InjectRepository(EmployeeJobInformation)
    private employeeJobInformationRepository: Repository<EmployeeJobInformation>,
    // private userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) { }
  async create(
    createEmployeeJobInformationDto: CreateEmployeeJobInformationDto,
    tenantId: string,
  ) {
    const user = this.employeeJobInformationRepository.create({
      ...createEmployeeJobInformationDto,
      tenantId,
    });
    try {
      return await this.employeeJobInformationRepository.save(user);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findAll(
    paginationOptions: PaginationDto,
  ): Promise<Pagination<EmployeeJobInformation>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder =
        await this.employeeJobInformationRepository.createQueryBuilder(
          'employeeJobInformation',
        );

      return await this.paginationService.paginate<EmployeeJobInformation>(
        queryBuilder,
        options,
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`EmployeeJobInformation not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const employeejobinformation = await this.employeeJobInformationRepository
        .createQueryBuilder('employee-job-information')
        .where('employee-job-information.id = :id', { id })
        .getOne();

      return { ...employeejobinformation };
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
    updateEmployeeJobInformationDto: UpdateEmployeeJobInformationDto,
  ) {
    try {
      await this.employeeJobInformationRepository.findOneOrFail({
        where: { id: id },
      });
      await this.employeeJobInformationRepository.update(
        { id },
        updateEmployeeJobInformationDto,
      );
      return await this.employeeJobInformationRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `EmployeeJobInformation with id ${id} not found.`,
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.employeeJobInformationRepository.findOneOrFail({
        where: { id: id },
      });
      return await this.employeeJobInformationRepository.softDelete({ id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `EmployeeJobInformation with id ${id} not found.`,
        );
      }
      throw error;
    }
  }
}
