import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { OffboardingTasksTemplateController } from './offboarding-tasks-template.controller';
import { OffboardingTasksTemplateService } from './offboarding-tasks-template.service';
import { OffboardingTasksTemplate } from './entities/offboarding-tasks-template..entity';

@Module({
  imports: [TypeOrmModule.forFeature([OffboardingTasksTemplate])],
  controllers: [OffboardingTasksTemplateController],
  providers: [OffboardingTasksTemplateService, PaginationService],
  exports: [OffboardingTasksTemplateService],
})
export class OffboardingTasksTemplateModule { }
