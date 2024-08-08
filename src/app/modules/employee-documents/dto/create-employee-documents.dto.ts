import {
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEmployeeDocumentDto {
  @IsOptional()
  documentName: any;

  @IsString()
  @IsOptional()
  documentLink: string;
}

