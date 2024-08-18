import { Module } from '@nestjs/common';
import { NationalityService } from './nationality.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nationality } from './entities/nationality.entity';
import { NationalitysController } from './nationality.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Nationality])],
  controllers: [NationalitysController],
  providers: [NationalityService, PaginationService],
  exports: [NationalityService],
})
export class NationalityModule {}
