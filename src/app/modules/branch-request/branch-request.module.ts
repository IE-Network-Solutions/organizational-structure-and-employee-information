import { Module } from '@nestjs/common';
import { BranchRequestController } from './branch-request.controller';
import { BranchRequestService } from './branch-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchRequest } from './entities/branch-request.entity';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([BranchRequest]), HttpModule],
  controllers: [BranchRequestController],
  providers: [BranchRequestService, PaginationService],
  exports: [BranchRequestService],
})
export class BranchRequestModule {}
