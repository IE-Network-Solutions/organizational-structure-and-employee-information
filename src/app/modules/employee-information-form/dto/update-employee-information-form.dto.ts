import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeInformationFormDto } from './create-employee-information-form.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeInformationFormDto extends PartialType(
  CreateEmployeeInformationFormDto,
) {}
