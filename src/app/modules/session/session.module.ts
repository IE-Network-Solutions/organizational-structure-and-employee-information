import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { PaginationModule } from '@root/src/core/pagination/pagination.module';
import { MonthModule } from '../month/month.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session]),PaginationModule,MonthModule],
  controllers: [SessionController],
  providers: [SessionService],
  exports:[SessionService]
})
export class SessionModule {}
