import { Module } from '@nestjs/common';
import { EmployeeJobInformationService } from './employee-job-information.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeJobInformation } from './entities/employee-job-information.entity';
import { EmployeeJobInformationsController } from './employee-job-information.controller';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeJobInformation])],
  controllers: [EmployeeJobInformationsController],
  providers: [EmployeeJobInformationService, PaginationService],
  exports: [EmployeeJobInformationService],
})
export class EmployeeJobInformationModule {}
