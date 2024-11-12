import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { EmployeeTermination } from './entities/employee-termination.entity';
import { checkIfDataExistsInEveryColumn } from '@root/src/core/utils/checkIfDataExists.util';
import { CreateEmployeeTerminationDto } from './dto/create-employee-termination.dto';
import { UpdateEmployeeTerminationDto } from './dto/update-employee-termination.dto';
import { UserService } from '../users/services/user.service';
import { User } from '../users/entities/user.entity';
import { EmployeeJobInformationService } from '../employee-job-information/employee-job-information.service';
import { CreateEmployeeJobInformationDto } from '../employee-job-information/dto/create-employee-job-information.dto';
import { EmployeeInformationService } from '../employee-information/employee-information.service';
import { UpdateEmployeeInformationDto } from '../employee-information/dto/update-employee-information.dto';
import { Connection } from 'typeorm';
@Injectable()
export class EmployeeTerminationService {
  constructor(
    @InjectRepository(EmployeeTermination)
    private employeeTerminationRepository: Repository<EmployeeTermination>,
    @InjectDataSource() private dataSource: DataSource,
    private paginationService: PaginationService,
    private userService: UserService,
    private employeeJobInformationService: EmployeeJobInformationService,
    private employeenformationService: EmployeeInformationService,
  ) {}
  async create(
    createEmployeeTerminationDto: CreateEmployeeTerminationDto,
    tenantId: string,
  ): Promise<EmployeeTermination> {
    try {
      const createEmployeeTermination =
        await this.employeeTerminationRepository.create({
          ...createEmployeeTerminationDto,
          tenantId: tenantId,
        });
      const valuesToCheck = {
        isActive: 'true',
        userId: createEmployeeTerminationDto.userId,
      };
      await checkIfDataExistsInEveryColumn(
        valuesToCheck,
        this.employeeTerminationRepository,
      );
      const check = await this.employeeTerminationRepository.save(
        createEmployeeTermination,
      );
      if (check) {
        await this.userService.remove(createEmployeeTerminationDto?.userId);
        return check;
      }
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findAll(
    tenantId: string,
    paginationOptions: PaginationDto,
  ): Promise<Pagination<EmployeeTermination>> {
    const options: IPaginationOptions = {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };

    const paginatedData =
      await this.paginationService.paginate<EmployeeTermination>(
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
      const client = await this.employeeTerminationRepository.findOneOrFail({
        where: { id: id },
      });
      return client;
    } catch (error) {
      throw new NotFoundException(
        `Employee Termination with Id ${id} not found`,
      );
    }
  }
  async findOneByUserIdWithJobInfo(userId: string): Promise<any> {
    try {
      const termination = await this.employeeTerminationRepository.findOne({
        where: { userId: userId, isActive: true },
        relations: ['jobInformation'],
      });
      return termination;
    } catch (error) {
      throw new NotFoundException(
        `Employee Termination with User Id ${userId} not found`,
      );
    }
  }
  async update(
    id: string,
    updateEmployeeTerminationDto: UpdateEmployeeTerminationDto,
  ): Promise<any> {
    try {
      await this.findOne(id);
      await this.employeeTerminationRepository.update(
        id,
        updateEmployeeTerminationDto,
      );
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
        throw new NotFoundException(
          `Employee Termination with Id ${id} not found`,
        );
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

  async rehireUser(
    userId: string,
    tenantId: string,
    createEmployeeJobInformationDto: CreateEmployeeJobInformationDto,
  ): Promise<User> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      createEmployeeJobInformationDto.effectiveStartDate =
        createEmployeeJobInformationDto['joinedDate'];
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      const termination = await this.employeeTerminationRepository.findOne({
        where: {
          userId: userId,
          isActive: true,
        },
      });

      if (!termination) {
        await this.userService.activateUser(userId, tenantId);
        await this.employeeJobInformationService.create(
          createEmployeeJobInformationDto,
          tenantId,
        );

        const employeeInformation =
          await this.employeenformationService.findOne(userId);
        const updateEmployeeInformation: UpdateEmployeeInformationDto = {
          joinedDate: createEmployeeJobInformationDto['joinedDate'],
        };

        await this.employeenformationService.update(
          employeeInformation.id,
          updateEmployeeInformation,
        );
      } else {
        await this.update(termination.id, { isActive: false });
        await this.userService.activateUser(userId, tenantId);
        await this.employeeJobInformationService.create(
          createEmployeeJobInformationDto,
          tenantId,
        );
      }

      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new ConflictException(error);
    } finally {
      await queryRunner.release();
    }
  }
}
