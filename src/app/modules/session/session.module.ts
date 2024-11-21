import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { PaginationModule } from '@root/src/core/pagination/pagination.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session]),PaginationModule],
  controllers: [SessionController],
  providers: [SessionService]
})
export class SessionModule {}
