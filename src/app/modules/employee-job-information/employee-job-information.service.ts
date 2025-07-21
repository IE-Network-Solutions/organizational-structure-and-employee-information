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
import { BasicSalaryService } from '../basic-salary/basic-salary.service';
import { CalendarsService } from '../calendars/calendars.service';

@Injectable()
export class EmployeeJobInformationService {
  constructor(
    @InjectRepository(EmployeeJobInformation)
    private employeeJobInformationRepository: Repository<EmployeeJobInformation>,
    private readonly paginationService: PaginationService,
    private readonly basicSalaryService: BasicSalaryService, // Inject BasicSalaryService
    private readonly calenderService: CalendarsService,
  ) {}
  async create(
    createEmployeeJobInformationDto: CreateEmployeeJobInformationDto,
    tenantId: string,
  ) {
    if (createEmployeeJobInformationDto?.userId) {
      const employeeJobInfo = await this.employeeJobInformationRepository.find({
        where: {
          userId: createEmployeeJobInformationDto.userId,
          isPositionActive: true,
        },
      });
      if (employeeJobInfo?.length > 0) {
        for (const job of employeeJobInfo) {
          const dataToUpdate = new UpdateEmployeeJobInformationDto();
          dataToUpdate.isPositionActive = false;
          await this.update(job.id, dataToUpdate);
        }
      }
    }
    const user = this.employeeJobInformationRepository.create({
      ...createEmployeeJobInformationDto,
      tenantId,
    });
    try {
      const savedJobInfo = await this.employeeJobInformationRepository.save(
        user,
      );
      if (createEmployeeJobInformationDto.basicSalary) {
        await this.basicSalaryService.create(
          {
            basicSalary: createEmployeeJobInformationDto.basicSalary,
            status: true,
            userId: savedJobInfo.userId,
            jobInfoId: savedJobInfo.id,
          },
          tenantId,
        );
      }

      return savedJobInfo;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }


  async getActiveCalendarhired(tenantId: string) {
    try {
      const paginationOptions = new PaginationDto();
      const employeeJobInformation = await this.findAll(paginationOptions);
      const activeCalendar = await this.calenderService.findActiveCalendar(tenantId);
      const calendarStart = new Date(activeCalendar.startDate);
      const calendarEnd = new Date(activeCalendar.endDate);

      // Prepare months array
      const months = [];
      const current = new Date(
        calendarStart.getFullYear(),
        calendarStart.getMonth(),
        1,
      );
      const end = new Date(
        calendarEnd.getFullYear(),
        calendarEnd.getMonth(),
        1,
      );
      while (current <= end) {
        months.push({
          month: current.toLocaleString('default', { month: 'short' }),
          year: current.getFullYear(),
          hired: 0,
        });
        current.setMonth(current.getMonth() + 1);
      }

      // Count hires per month
      employeeJobInformation.items.forEach((emp) => {
        const effStart = new Date(emp.effectiveStartDate);
        if (effStart >= calendarStart && effStart <= calendarEnd) {
          const month = effStart.toLocaleString('default', { month: 'short' });
          const year = effStart.getFullYear();
          const found = months.find(
            (m) => m.month === month && m.year === year,
          );
          if (found) found.hired += 1;
        }
      });

      // Return in requested format (without year if you want)
      return months.map(({ month, hired }) => ({ month, hired }));
    } catch (error) {
      throw new NotFoundException(`There Is No Active Calendar.`);
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
  async updatebranchRequest(
    userId: string,
    updateEmployeeJobInformationDto: UpdateEmployeeJobInformationDto,
  ) {
    try {
      const existingRecord =
        await this.employeeJobInformationRepository.findOne({
          where: { userId, isPositionActive: true },
        });

      if (!existingRecord) {
        throw new NotFoundException(
          `EmployeeJobInformation with userId ${userId} not found or position is inactive.`,
        );
      }

      await this.employeeJobInformationRepository.update(
        { userId },
        updateEmployeeJobInformationDto,
      );

      const updatedRecord = await this.employeeJobInformationRepository.findOne(
        {
          where: { userId },
        },
      );

      if (!updatedRecord) {
        throw new NotFoundException(
          `Failed to retrieve updated EmployeeJobInformation for userId ${userId}.`,
        );
      }

      return updatedRecord;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `EmployeeJobInformation with userId ${userId} not found.`,
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

  async submitResignation(id: string) {
    try {
      const jobInfo = await this.employeeJobInformationRepository.findOneOrFail(
        {
          where: { id: id },
        },
      );

      if (jobInfo.resignationSubmittedDate) {
        throw new ConflictException(
          'Resignation has already been submitted for this employee.',
        );
      }

      const updateData = {
        resignationSubmittedDate: new Date(),
      };

      return await this.employeeJobInformationRepository.update(
        { id },
        updateData,
      );
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
