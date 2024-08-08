import { forwardRef, Module } from '@nestjs/common';

import { EmployeeInformationController } from './employee-information.controller';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeInformation } from './entities/employee-information.entity';
import { EmployeeInformationService } from './employee-information.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeInformation]),
  ],
  controllers: [EmployeeInformationController],
  providers: [EmployeeInformationService, PaginationService],
  exports: [EmployeeInformationService],
})
export class EmployeeInformationModule { }
