import { Module } from '@nestjs/common';
import { EmployeeTypeService } from './employee-type.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeType } from './entities/employee-type.entity';
import { EmployeeTypesController } from './employee-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeType])],
  controllers: [EmployeeTypesController],
  providers: [EmployeeTypeService, PaginationService],
  exports: [EmployeeTypeService],
})
export class EmployeeTypeModule {}
