// import { MaritalStatus } from '@root/dist/core/enum/marital-status.tenum';
import { Gender } from '@root/src/core/enum/gender.enum';
import { MaritalStatus } from '@root/src/core/enum/marital-status.enum';
import {
  IsEnum,
  IsJSON,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';

export class CreateEmployeeInformationDto {
  @IsOptional()
  @IsString()
  employeeAttendanceId?: string;
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus: MaritalStatus;

  @IsOptional()
  @IsString()
  dateOfBirth: Date;

  @IsOptional()
  @IsString()
  joinedDate: string;

  @IsOptional()
  @IsString()
  nationalityId: string;

  @Validate(IsJSON, {
    message: 'address must be json',
  })
  addresses: string;

  @Validate(IsJSON, {
    message: 'emergency contact must be json',
  })
  emergencyContact: string;

  @Validate(IsJSON, {
    message: 'Bank Information contact must be json',
  })
  bankInformation: string;

  @Validate(IsJSON, {
    message: 'additional Information contact must be json',
  })
  additionalInformation: string;
}
