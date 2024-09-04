import { Module } from '@nestjs/common';
// import { CoreModule } from '@app/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppConfigModule } from '@config/app.config.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { SharedModule } from '../core/shared.module';
import { CoreModule } from './core.module';
import { AppConfigModule } from '../config/app.config.module';
import { TenantGuard } from '../core/guards/tenant.guard';
import { APP_GUARD } from '@nestjs/core';
import { CalendarSubscriber } from './modules/calendars/subscribers/calendar.subscriber';
import { BranchSubscriber } from './modules/branchs/subscribers/branch.subscriber';
import { WorkScheduleSubscriber } from './modules/work-schedules/subscribers/work-schedules.subscribers';
import { HealthModule } from './modules/health/health.module';
import { AuthGuard } from '../core/guards/auth.guard';
import { UserSubscriber } from './modules/users/subscribers/user.subscriber';

/** This is a TypeScript module that imports various modules and sets up a TypeORM connection using
configuration values obtained from a ConfigService. */
@Module({
  imports: [
    AppConfigModule,
    CoreModule,
    SharedModule,
    ThrottlerModule.forRoot({
      ttl: 60, // The time-to-live for each request count record (in seconds)
      limit: 10, // The maximum number of requests allowed in the given time period
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'sqlite' | 'postgres'>('db.type'),
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.user'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.name'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('db.synchronize'),
        subscribers: [
          CalendarSubscriber,
          BranchSubscriber,
          WorkScheduleSubscriber,
          UserSubscriber,
        ],
      }),
      inject: [ConfigService],
    }),
    // TypeOrmModule.forRootAsync(dataSource),
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
