import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBasicSalaryDto } from './dto/create-basic-salary.dto';
import { UpdateBasicSalaryDto } from './dto/update-basic-salary.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicSalary } from './entities/basic-salary.entity';
import { Repository } from 'typeorm';
import { UserService } from '../users/services/user.service';
import { EmployeeJobInformationService } from '../employee-job-information/employee-job-information.service';

@Injectable()
export class BasicSalaryService {
  constructor(
    @InjectRepository(BasicSalary)
    private readonly basicSalaryRepository: Repository<BasicSalary>,
    private readonly employeeJobInformationService: EmployeeJobInformationService,
    private readonly user: UserService,
  ) {}
  async create(
    createBasicSalaryDto: CreateBasicSalaryDto,
  ): Promise<BasicSalary> {
    const user = await this.user.findOne(createBasicSalaryDto.userId);
    const jobInfo = await this.employeeJobInformationService.findOne(
      createBasicSalaryDto.jobInfoId,
    );

    if (!user || !jobInfo) {
      throw new NotFoundException('User or Job Info not found');
    }

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
      user,
      jobInfo,
    });

    return this.basicSalaryRepository.save(basicSalary);
  }

  findAll(): Promise<BasicSalary[]> {
    return this.basicSalaryRepository.find({ relations: ['user', 'jobInfo'] });
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

    const user = updateBasicSalaryDto.userId
      ? await this.user.findOne(updateBasicSalaryDto.userId)
      : basicSalary.user;

    const jobInfo = updateBasicSalaryDto.jobInfoId
      ? await this.employeeJobInformationService.findOne(
          updateBasicSalaryDto.jobInfoId,
        )
      : basicSalary.jobInfo;

    if (!user || !jobInfo) {
      throw new NotFoundException('User or Job Info not found');
    }

    basicSalary.basicSalary =
      updateBasicSalaryDto.basicSalary ?? basicSalary.basicSalary;
    basicSalary.status = updateBasicSalaryDto.status ?? basicSalary.status;
    basicSalary.user = user;
    basicSalary.jobInfo = jobInfo;

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
