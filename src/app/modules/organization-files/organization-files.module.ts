import { Module } from '@nestjs/common';
import { OrganizationFilesService } from './organization-files.service';
import { OrganizationFilesController } from './organization-files.controller';
import { OrganizationFile } from './entities/organization-file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationModule } from '@root/src/core/pagination/pagination.module';
import { FileUploadModule } from '@root/src/core/upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationFile]),
    PaginationModule,
    FileUploadModule,
  ],

  controllers: [OrganizationFilesController],
  providers: [OrganizationFilesService],
})
export class OrganizationFilesModule {}
