import {
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEmployeeDocumentsDto {
  @IsString()
  documentName: string;

  @IsString()
  @IsOptional()
  documentLink: string;
}
