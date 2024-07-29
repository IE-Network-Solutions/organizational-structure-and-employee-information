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
  @IsString()
  jobTitle: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  branchId: string;

  @IsBoolean()
  isPositionActive: boolean;

  @IsDateString()
  effectiveStartDate: Date;

  @IsOptional()
  @IsDateString()
  effectiveEndDate?: Date;

  @IsUUID()
  employmentTypeId: string;

  @IsUUID()
  departmentId: string;

  @IsBoolean()
  departmentLeadOrNot: boolean;

  @IsEnum(['permanent', 'contractual'])
  employmentContractType: string;

  @IsUUID()
  workScheduleId: string;
}
