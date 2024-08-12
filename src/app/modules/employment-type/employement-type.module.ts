import { Module } from '@nestjs/common';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployementTypesController } from './employement-type.controller';
import { EmployementTypeService } from './employement-type.service';
import { EmployementType } from './entities/employement-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployementType])],
  controllers: [EmployementTypesController],
  providers: [EmployementTypeService, PaginationService],
  exports: [EmployementTypeService],
})
export class EmployementTypeModule { }
