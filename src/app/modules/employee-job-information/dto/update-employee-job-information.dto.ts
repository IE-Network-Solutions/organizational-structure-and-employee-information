import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeJobInformationDto } from './create-employee-job-information.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeJobInformationDto extends PartialType(
  CreateEmployeeJobInformationDto,
) {}
