import { Module } from '@nestjs/common';
import { MonthService } from './month.service';
import { MonthController } from './month.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Month } from './entities/month.entity';
import { PaginationModule } from '@root/src/core/pagination/pagination.module';

@Module({
  imports: [TypeOrmModule.forFeature([Month]),PaginationModule],
  controllers: [MonthController],
  providers: [MonthService]
})
export class MonthModule {}
