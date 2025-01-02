import { Module } from '@nestjs/common';
import { BasicSalaryService } from './basic-salary.service';
import { BasicSalaryController } from './basic-salary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasicSalary } from './entities/basic-salary.entity';

import { EmployeeJobInformationModule } from '../employee-job-information/employee-job-information.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BasicSalary]),
    EmployeeJobInformationModule,
    UserModule,
  ],
  controllers: [BasicSalaryController],
  providers: [BasicSalaryService],
})
export class BasicSalaryModule {}
