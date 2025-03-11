import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delegation } from './entities/delegation.entity';
import { DelegationController } from './delegations.controller';
import { DelegationService } from './delegations.service';
import { PaginationModule } from '@root/src/core/pagination/pagination.module';

@Module({
  imports: [TypeOrmModule.forFeature([Delegation]), PaginationModule],
  controllers: [DelegationController],
  providers: [DelegationService],
  exports: [DelegationService],
})
export class DelegationModule {}
