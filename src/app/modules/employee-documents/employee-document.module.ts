import { Module } from '@nestjs/common';
import { EmployeeDocumentService } from './employee-document.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeDocument } from './entities/employee-documents.entity';
import { EmployeeDocumentController } from './employee-document.controller';
import { FileUploadModule } from '@root/src/core/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeDocument]), FileUploadModule],
  controllers: [EmployeeDocumentController],
  providers: [EmployeeDocumentService, PaginationService],
  exports: [EmployeeDocumentService],
})
export class EmployeeDocumentModule {}
