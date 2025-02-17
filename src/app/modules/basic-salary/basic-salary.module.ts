import { Module } from '@nestjs/common';
import { BasicSalaryService } from './basic-salary.service';
import { BasicSalaryController } from './basic-salary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasicSalary } from './entities/basic-salary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BasicSalary])],
  controllers: [BasicSalaryController],
  providers: [BasicSalaryService],
  exports: [BasicSalaryService],
})
export class BasicSalaryModule {}
