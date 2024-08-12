import { Module } from '@nestjs/common';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmploymentType } from './entities/employement-type.entity';
import { EmployementTypesController } from './employement-type.controller';
import { EmployementTypeService } from './employement-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmploymentType])],
  controllers: [EmployementTypesController],
  providers: [EmployementTypeService, PaginationService],
  exports: [EmployementTypeService],
})
export class EmployementTypeModule {}
