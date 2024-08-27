import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { EmployeeTermination } from './entities/employee-termination.entity';
import { checkIfDataExists } from '@root/src/core/utils/checkIfDataExists.util';
import { CreateEmployeeTerminationDto } from './dto/create-employee-termination.dto';
import { UpdateEmployeeTerminationDto } from './dto/update-employee-termination.dto';

@Injectable()
export class EmployeeTerminationService {
  constructor(
    @InjectRepository(EmployeeTermination) 
    private employeeTerminationRepository: Repository<EmployeeTermination>,
    private paginationService: PaginationService,
  ) {}
  async create(
    createEmployeeTerminationDto: CreateEmployeeTerminationDto,
    tenantId: string,
  ): Promise<EmployeeTermination> {
    
    try {
      const createEmployeeTermination = await this.employeeTerminationRepository.create({
        ...createEmployeeTerminationDto,
        tenantId: tenantId,
      });
      const valuesToCheck = { reason:createEmployeeTerminationDto.reason}
      await checkIfDataExists(valuesToCheck,this.employeeTerminationRepository)
      return await this.employeeTerminationRepository.save(createEmployeeTermination);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findAll(
    paginationOptions: PaginationDto,
    tenantId: string,
  ): Promise<Pagination<EmployeeTermination>> {
    const options: IPaginationOptions = {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };

    const paginatedData = await this.paginationService.paginate<EmployeeTermination>(
      this.employeeTerminationRepository,
      'p',
      options,
      paginationOptions.orderBy,
      paginationOptions.orderDirection,
      { tenantId },
    );
    return paginatedData;
  }

  async findOne(id: string): Promise<EmployeeTermination> {
    try {
      const client = await this.employeeTerminationRepository.findOneOrFail({ where:{id:id} });
      return client;
    } catch (error) {
      throw new NotFoundException(`Employee Termination with Id ${id} not found`);
    }
  }
  async update(
    id: string,
    updateEmployeeTerminationDto: UpdateEmployeeTerminationDto,
  ): Promise<any> {
    try {
       await this.findOne(id);
       await this.employeeTerminationRepository.update(id , updateEmployeeTerminationDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async remove(id: string): Promise<EmployeeTermination> {
    try {
      const employeeTermination = await this.findOne(id);
      if (!employeeTermination) {
        throw new NotFoundException(`Employee Termination with Id ${id} not found`);
      }
      await this.employeeTerminationRepository.softRemove({ id });
      return employeeTermination;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
