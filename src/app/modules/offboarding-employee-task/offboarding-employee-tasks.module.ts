import { OffboardingEmployeeTask } from './entities/offboarding-employee-task.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { OffboardingEmployeeTaskController } from './offboarding-employee-tasks.controller';
import { OffboardingEmployeeTaskService } from './offboarding-employee-task.service';

@Module({
  imports: [TypeOrmModule.forFeature([OffboardingEmployeeTask])],
  controllers: [OffboardingEmployeeTaskController],
  providers: [OffboardingEmployeeTaskService, PaginationService],
  exports: [OffboardingEmployeeTaskService],
})
export class OffboardingEmployeeTaskModule {}
