import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeTypeDto } from './create-employee-type.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeTypeDto extends PartialType(CreateEmployeeTypeDto) {}
