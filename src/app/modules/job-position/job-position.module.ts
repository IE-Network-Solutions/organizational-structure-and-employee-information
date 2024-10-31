import { Module } from '@nestjs/common';
import { JobPositionService } from './job-position.service';
import { JobPositionController } from './job-position.controller';
import { JobPosition } from './entities/job-position.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '@root/src/core/pagination/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobPosition])],
  controllers: [JobPositionController],
  providers: [JobPositionService, PaginationService],
  exports: [JobPositionService],
})
export class JobPositionModule {}
