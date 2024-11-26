import { Gender } from '@root/src/core/enum/gender.enum';
import { MaritalStatus } from '@root/src/core/enum/marital-status.enum';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ImportEmployeeDto {
  //   @IsUUID()
  //   tenantId: string;

  @IsOptional()
  employeeAttendanceId?: string;

  @IsNumber()
  userId: number;

  @IsString()
  firstName: string;

  @IsString()
  middleName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsEmail()
  email: string;

  @IsString()
  roleId: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus: MaritalStatus;

  @IsDateString()
  dateOfBirth: Date;

  @IsDateString()
  joinedDate: string;

  @IsString()
  jobPositionId: string;

  @IsString()
  nationalityId: string;

  @IsString()
  branchId: string;

  @IsBoolean()
  isPositionActive: boolean;

  @IsDateString()
  effectiveStartDate: string;

  @IsOptional()
  @IsDateString()
  effectiveEndDate?: string;

  @IsString()
  employmentTypeId: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsBoolean()
  departmentLeadOrNot: boolean;

  @IsString()
  employmentContractType: string;

  @IsString()
  workScheduleId: string;

  @IsOptional()
  @IsString()
  bankAccountNumber?: string;

  @IsOptional()
  @IsString()
  bankAccountName?: string;
}
