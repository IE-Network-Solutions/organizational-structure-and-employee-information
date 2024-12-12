import { forwardRef, Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { Department } from './entities/department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { EmployeeJobInformationModule } from '../employee-job-information/employee-job-information.module';

@Module({
  imports: [TypeOrmModule.forFeature([Department]), forwardRef(() => UserModule), EmployeeJobInformationModule],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}