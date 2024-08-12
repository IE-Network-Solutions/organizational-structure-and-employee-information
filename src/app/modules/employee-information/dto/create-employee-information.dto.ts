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
  joinedDate: Date;

  @IsOptional()
  @IsString()
  nationalityId: string;

  @IsOptional()
  @IsString()
  addresses: string;

  @Validate(IsJSON, {
    message: 'emergency contact must be string',
  })
  emergencyContact: string;

  @Validate(IsJSON, {
    message: 'Bank Information contact must be string',
  })
  bankInformation: string;

  @Validate(IsJSON, {
    message: 'additional Information contact must be string',
  })
  additionalInformation: string;
}
