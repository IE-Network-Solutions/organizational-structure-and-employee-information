import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { EmployeeTermination } from './entities/employee-termination.entity';
import { EmployementTypeService } from '../employment-type/__mocks__/employement-type.service';
import { BranchesController } from '../branchs/branches.controller';
import { EmployeeTerminationController } from './employee-termination.controller';
import { EmployeeTerminationService } from './employee-termination.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeTermination])],
  controllers: [EmployeeTerminationController],
  providers: [EmployeeTerminationService, PaginationService],
})
export class EmployeeTerminationModule {}
