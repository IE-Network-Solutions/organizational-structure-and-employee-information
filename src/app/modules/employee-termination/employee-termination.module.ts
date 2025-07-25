import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { EmployeeTermination } from './entities/employee-termination.entity';
import { EmployementTypeService } from '../employment-type/__mocks__/employement-type.service';
import { BranchesController } from '../branchs/branches.controller';
import { EmployeeTerminationController } from './employee-termination.controller';
import { EmployeeTerminationService } from './employee-termination.service';
import { UserModule } from '../users/user.module';
import { User } from '../users/entities/user.entity';
import { EmployeeJobInformationModule } from '../employee-job-information/employee-job-information.module';
import { EmployeeInformationModule } from '../employee-information/employee-information.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeTermination, User]),
    UserModule,
    EmployeeJobInformationModule,
    EmployeeInformationModule,
  ],
  controllers: [EmployeeTerminationController],
  providers: [EmployeeTerminationService, PaginationService],
})
export class EmployeeTerminationModule {}
