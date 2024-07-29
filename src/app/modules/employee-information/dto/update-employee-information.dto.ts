import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeInformationDto } from './create-employee-information.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeInformationDto extends PartialType(
  CreateEmployeeInformationDto,
) {}
