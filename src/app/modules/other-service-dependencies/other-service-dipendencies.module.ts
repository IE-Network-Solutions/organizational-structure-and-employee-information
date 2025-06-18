import { Module } from '@nestjs/common';
import { OtherServiceDependenciesService } from './other-service-dependencies.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FileUploadModule } from '@root/src/core/upload/upload.module';

@Module({
  imports: [ConfigModule, HttpModule, FileUploadModule],
  providers: [OtherServiceDependenciesService],
  exports: [OtherServiceDependenciesService],
})
export class OtherServiceDependenciesModule {}
