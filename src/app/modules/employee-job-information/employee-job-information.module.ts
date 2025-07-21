import { Module, forwardRef } from '@nestjs/common';
import { EmployeeJobInformationService } from './employee-job-information.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeJobInformation } from './entities/employee-job-information.entity';
import { EmployeeJobInformationsController } from './employee-job-information.controller';
import { BasicSalaryModule } from '../basic-salary/basic-salary.module';
import { CalendarsModule } from '../calendars/calendars.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeJobInformation]),
    BasicSalaryModule,
    forwardRef(() => CalendarsModule),
  ],
  controllers: [EmployeeJobInformationsController],
  providers: [EmployeeJobInformationService, PaginationService],
  exports: [EmployeeJobInformationService],
})
export class EmployeeJobInformationModule {}
