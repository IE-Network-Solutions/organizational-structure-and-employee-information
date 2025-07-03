import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { SharedModule } from '@root/src/core/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Branch]), SharedModule],
  controllers: [BranchesController],
  providers: [BranchesService, PaginationService],
  exports: [BranchesService],
})
export class BranchesModule {}
