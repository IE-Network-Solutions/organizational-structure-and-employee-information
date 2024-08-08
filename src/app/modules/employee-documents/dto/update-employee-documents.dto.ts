import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDocumentDto } from './create-employee-documents.dto';

export class UpdateEmployeeDocumentDto extends PartialType(
  CreateEmployeeDocumentDto,
) { }
