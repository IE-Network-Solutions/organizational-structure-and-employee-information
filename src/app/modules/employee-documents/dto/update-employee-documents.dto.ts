import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDocumentsDto } from './create-employee-documents.dto';

export class UpdateEmployeeDocumentsDto extends PartialType(
  CreateEmployeeDocumentsDto,
) {}
