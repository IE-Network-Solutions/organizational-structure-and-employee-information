// create-employee-information-form.dto.ts

import {
  IsString,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class FormField {
  id?: string;

  @IsString()
  fieldName: string;

  @IsString()
  fieldType: string;

  @IsBoolean()
  isActive: boolean;
}

export class CreateEmployeeInformationFormDto {
  @IsOptional()
  @IsString()
  formTitle: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormField)
  form: FormField[];
}
