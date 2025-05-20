import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBasicSalaryDto } from './dto/create-basic-salary.dto';
import { UpdateBasicSalaryDto } from './dto/update-basic-salary.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicSalary } from './entities/basic-salary.entity';
import { IsNull, Repository } from 'typeorm';
import { tenantId } from '../branchs/tests/branch.data';

@Injectable()
export class BasicSalaryService {
  constructor(
    @InjectRepository(BasicSalary)
    private readonly basicSalaryRepository: Repository<BasicSalary>,
  ) {}
  async create(
    createBasicSalaryDto: CreateBasicSalaryDto,
    tenantId: string,
  ): Promise<BasicSalary> {
    const existingSalaries = await this.basicSalaryRepository.find({
      where: { user: { id: createBasicSalaryDto.userId } },
    });

    if (existingSalaries.length > 0) {
      for (const salary of existingSalaries) {
        salary.status = false;
        await this.basicSalaryRepository.save(salary);
      }
    }

    const basicSalary = this.basicSalaryRepository.create({
      basicSalary: createBasicSalaryDto.basicSalary,
      status: true,
      userId: createBasicSalaryDto.userId,
      jobInfoId: createBasicSalaryDto.jobInfoId,
      tenantId: tenantId,
    });

    return this.basicSalaryRepository.save(basicSalary);
  }

  findAll(tenantId: string): Promise<BasicSalary[]> {
    return this.basicSalaryRepository.find({
      where: { tenantId: tenantId },
      relations: ['user', 'jobInfo'],
    });
  }

  async getActiveBasicSalaries(
    tenantId: string,
  ): Promise<{ userId: string; basicSalary: number }[]> {
    const salaries = await this.basicSalaryRepository.find({
      where: { status: true, tenantId: tenantId, user: { deletedAt: null } },
      select: ['userId', 'basicSalary'],
    });

    return salaries;
  }
  async getActiveBasicSalariesOfActiveUsers(
    tenantId: string,
  ): Promise<{ userId: string; basicSalary: number }[]> {
    const salaries = await this.basicSalaryRepository.find({
      where: {
        status: true,
        tenantId: tenantId,
        user: {
          deletedAt: IsNull(),
          employeeJobInformation: { isPositionActive: true },
        },
      },
      select: ['userId', 'basicSalary'],
    });

    return salaries;
  }

  findAllByUserId(userId: string): Promise<BasicSalary[]> {
    return this.basicSalaryRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'jobInfo'],
    });
  }

  findOne(id: string): Promise<BasicSalary> {
    return this.basicSalaryRepository.findOne({
      where: { id },
      relations: ['user', 'jobInfo'],
    });
  }

  async update(
    id: string,
    updateBasicSalaryDto: UpdateBasicSalaryDto,
  ): Promise<BasicSalary> {
    const basicSalary = await this.findOne(id);

    if (!basicSalary) {
      throw new NotFoundException('Basic Salary not found');
    }

    basicSalary.basicSalary =
      updateBasicSalaryDto.basicSalary ?? basicSalary.basicSalary;
    basicSalary.status = updateBasicSalaryDto.status ?? basicSalary.status;

    if (updateBasicSalaryDto.userId) {
      basicSalary.userId = updateBasicSalaryDto.userId;
    }

    if (updateBasicSalaryDto.jobInfoId) {
      basicSalary.jobInfoId = updateBasicSalaryDto.jobInfoId;
    }

    return this.basicSalaryRepository.save(basicSalary);
  }

  async remove(id: string): Promise<void> {
    const basicSalary = await this.findOne(id);
    if (!basicSalary) {
      throw new Error('BasicSalary not found');
    }

    await this.basicSalaryRepository.remove(basicSalary);
  }
}
