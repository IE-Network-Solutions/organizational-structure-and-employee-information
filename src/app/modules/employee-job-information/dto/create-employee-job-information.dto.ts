import { EmployementContractType } from '@root/src/core/enum/employement-contract-type.enum';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsBoolean,
  IsEnum,
  IsDateString,
  IsJSON,
} from 'class-validator';

export class CreateEmployeeJobInformationDto {
  @IsOptional()
  @IsString()
  jobTitle: string;

  @IsOptional()
  @IsString()
  branchId: string;

  @IsOptional()
  @IsBoolean()
  isPositionActive: boolean;

  @IsOptional()
  @IsDateString()
  effectiveStartDate: Date;

  @IsOptional()
  @IsDateString()
  effectiveEndDate?: Date;

  @IsOptional()
  @IsString()
  employmentTypeId: string;

  @IsOptional()
  @IsString()
  departmentId: string;

  @IsOptional()
  @IsBoolean()
  departmentLeadOrNot: boolean;

  @IsOptional()
  @IsEnum(EmployementContractType)
  employmentContractType: EmployementContractType;

  @IsOptional()
  @IsString()
  workScheduleId: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
