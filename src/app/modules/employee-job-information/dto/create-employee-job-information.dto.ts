import { EmployementContractType } from '@root/src/core/enum/employement-contract-type.enum';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { JobAction } from '../enum/job-action.enum';

export class CreateEmployeeJobInformationDto {
  @IsOptional()
  @IsString()
  positionId: string;

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
  employementTypeId: string;

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
  @IsEnum(JobAction)
  jobAction: JobAction;

  @IsOptional()
  @IsString()
  workScheduleId: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsNumber()
  basicSalary?: number;
}
