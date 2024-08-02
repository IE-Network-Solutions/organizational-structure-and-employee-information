import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { CreateEmployeeInformationDto } from './dto/create-employee-information.dto';
import { EmployeeInformation } from './entities/employee-information.entity';
import { UpdateEmployeeInformationDto } from './dto/update-employee-information.dto';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';

@Injectable()
export class EmployeeInformationService {
  constructor(
    @InjectRepository(EmployeeInformation)
    private userRepository: Repository<EmployeeInformation>,
    private readonly paginationService: PaginationService,
  ) { }

  async create(createEmployeeInformationDto: CreateEmployeeInformationDto, tenantId: string): Promise<EmployeeInformation> {
    const user = await this.userRepository.create({ ...createEmployeeInformationDto, tenantId });
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
  async findAll(
    paginationOptions: PaginationDto,
  ): Promise<Pagination<EmployeeInformation>> {
    try {
      const options: IPaginationOptions = {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
      const queryBuilder = await this.userRepository
        .createQueryBuilder('user')
        .orderBy('user.createdAt', 'DESC');

      return await this.paginationService.paginate<EmployeeInformation>(
        queryBuilder,
        options,
      );
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('employee_information')
        .where('employee_information.id = :id', { id })
        .getOne();

      return { ...user };
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }

  async update(
    id: string,
    UpdateEmployeeInformationDto: UpdateEmployeeInformationDto,
  ) {
    try {
      await this.userRepository.findOneOrFail({ where: { id: id } });
      await this.userRepository.update({ id }, UpdateEmployeeInformationDto);
      return await this.userRepository.findOneOrFail({ where: { id: id } });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.userRepository.findOneOrFail({ where: { id: id } });
      return await this.userRepository.softDelete({ id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }
}
