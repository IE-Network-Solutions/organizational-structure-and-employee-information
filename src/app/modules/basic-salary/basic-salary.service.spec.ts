import { Test, TestingModule } from '@nestjs/testing';
import { BasicSalaryService } from './basic-salary.service';
import { UserService } from '../users/services/user.service';
import { EmployeeJobInformationService } from '../employee-job-information/employee-job-information.service';
import { mock } from 'jest-mock-extended';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicSalary } from './entities/basic-salary.entity';

describe('BasicSalaryService', () => {
  let service: BasicSalaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BasicSalaryService,
        {
          provide: getRepositoryToken(BasicSalary),
          useValue: mock<Repository<BasicSalary>>(),
        },
        {
          provide: UserService,
          useValue: mock<UserService>(),
        },
        {
          provide: EmployeeJobInformationService,
          useValue: mock<EmployeeJobInformationService>(),
        },
      ],
    }).compile();

    service = module.get<BasicSalaryService>(BasicSalaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
