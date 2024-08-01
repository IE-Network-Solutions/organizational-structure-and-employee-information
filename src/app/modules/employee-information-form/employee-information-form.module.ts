import { Module } from '@nestjs/common';
import { EmployeeInformationFormService } from './employee-information-form.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeInformationForm } from './entities/employee-information-form.entity';
import { EmployeeInformationFormsController } from './employee-information-form.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeInformationForm])],
  controllers: [EmployeeInformationFormsController],
  providers: [EmployeeInformationFormService, PaginationService],
  exports: [EmployeeInformationFormService],
})
export class EmployeeInformationFormModule {}
