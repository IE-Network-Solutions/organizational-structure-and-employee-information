import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { OffboardingTasksTemplateController } from './offboarding-tasks-template.controller';
import { OffboardingEmployeeTask } from '../offboarding-employee-task/entities/offboarding-employee-task.entity';
import { OffboardingTasksTemplateService } from './offboarding-tasks-template.service';

@Module({
  imports: [TypeOrmModule.forFeature([OffboardingEmployeeTask])],
  controllers: [OffboardingTasksTemplateController],
  providers: [OffboardingTasksTemplateService, PaginationService],
  exports: [OffboardingTasksTemplateService],
})
export class OffboardingTasksTemplateModule { }
