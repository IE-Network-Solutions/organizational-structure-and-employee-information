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
import { SearchFilterDTO } from '@root/src/core/commonDto/search-filter-dto';
import { applySearchFilterUtils } from '@root/src/core/utils/search-filter.utils';

@Injectable()
export class EmployeeInformationService {
  constructor(
    @InjectRepository(EmployeeInformation)
    private employeeInformationRepository: Repository<EmployeeInformation>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    createEmployeeInformationDto: CreateEmployeeInformationDto,
    tenantId: string,
  ): Promise<EmployeeInformation> {
    const user = await this.employeeInformationRepository.create({
      ...createEmployeeInformationDto,
      tenantId,
    });
    try {
      return await this.employeeInformationRepository.save(user);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
  async findAll(
    paginationOptions: PaginationDto,
    searchFilterDTO: SearchFilterDTO,
    tenantId: string,
  ): Promise<Pagination<EmployeeInformation>> {
    const options: IPaginationOptions = {
      page: paginationOptions?.page,
      limit: paginationOptions?.limit,
    };

    try {
      const queryBuilder =
        this.employeeInformationRepository.createQueryBuilder(
          'employeeInformation',
        );

      await applySearchFilterUtils(
        queryBuilder,
        searchFilterDTO,
        this.employeeInformationRepository,
      );

      const paginatedData =
        await this.paginationService.paginate<EmployeeInformation>(
          this.employeeInformationRepository,
          'employeeInformation',
          options,
          paginationOptions.orderBy,
          paginationOptions.orderDirection,
          { tenantId },
        );
      return paginatedData;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Role not found.`);
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.employeeInformationRepository
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
    updateEmployeeInformationDto: UpdateEmployeeInformationDto,
  ) {
    try {
      await this.employeeInformationRepository.findOneOrFail({
        where: { id: id },
      });
      await this.employeeInformationRepository.update(
        { id },
        updateEmployeeInformationDto,
      );
      return await this.employeeInformationRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.employeeInformationRepository.findOneOrFail({
        where: { id: id },
      });
      return await this.employeeInformationRepository.softDelete({ id });
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      throw error;
    }
  }

  async findOneByUserId(userId: string) {
    try {
      const user = await this.employeeInformationRepository.findOne({
        where: { userId: userId },
      });

      return { ...user };
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`User with id ${userId} not found.`);
      }
      throw error;
    }
  }

  async getEmployeeBirthDay(tenantId: string) {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
    const employees = await this.employeeInformationRepository
      .createQueryBuilder('EmployeeInformation')
      .leftJoinAndSelect('EmployeeInformation.user', 'user')
      .where('EmployeeInformation.tenantId = :tenantId', { tenantId })
      .andWhere(
        'EXTRACT(MONTH FROM EmployeeInformation.dateOfBirth) = :month',
        { month: todayMonth },
      )
      .andWhere('EXTRACT(DAY FROM EmployeeInformation.dateOfBirth) = :day', {
        day: todayDay,
      })
      .getMany();

    return employees;
  }

  async getEmployeeAnniversary(tenantId: string) {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    const employees = await this.employeeInformationRepository
      .createQueryBuilder('EmployeeInformation')
      .leftJoinAndSelect('EmployeeInformation.user', 'user')
      .where('EmployeeInformation.tenantId = :tenantId', { tenantId })
      .andWhere('EXTRACT(MONTH FROM EmployeeInformation.joinedDate) = :month', {
        month: todayMonth,
      })
      .andWhere('EXTRACT(DAY FROM EmployeeInformation.joinedDate) = :day', {
        day: todayDay,
      })
      .getMany();

    return employees;
  }

  async employeeInformationByEmployeeId(
    tenantId: string,
    employeeId: number,
  ): Promise<EmployeeInformation> {
    try {
      const employeeInformation = await this.employeeInformationRepository
        .createQueryBuilder('employeeInformation')

        .leftJoinAndSelect('employeeInformation.user', 'user')

        .leftJoinAndSelect(
          'user.employeeJobInformation',
          'employeeJobInformation',
          'employeeJobInformation.isPositionActive = :isPositionActive',
          { isPositionActive: true },
        )
        // .leftJoinAndSelect('user.employeeInformation', 'employeeInformation')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect(
          'employeeJobInformation.employementType',
          'employementType',
        )
        .leftJoinAndSelect('employeeInformation.nationality', 'nationality')
        .leftJoinAndSelect('employeeJobInformation.branch', 'branch')
        .leftJoinAndSelect(
          'employeeJobInformation.workSchedule',
          'workSchedule',
        )
        .leftJoinAndSelect('employeeJobInformation.position', 'position')
        .leftJoinAndSelect('employeeJobInformation.department', 'department')
        .andWhere('user.tenantId = :tenantId', { tenantId })
        .andWhere(
          'employeeInformation.employeeAttendanceId = :employeeAttendanceId',
          { employeeAttendanceId: employeeId },
        )

        .getOne();

      return { ...employeeInformation };
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(`EmployeeInformation Not found.`);
      }
      throw error;
    }
  }
}
