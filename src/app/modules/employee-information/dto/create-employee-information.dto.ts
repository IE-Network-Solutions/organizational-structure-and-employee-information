// import { MaritalStatus } from '@root/dist/core/enum/marital-status.tenum';
import { Gender } from '@root/src/core/enum/gender.enum';
import { MaritalStatus } from '@root/src/core/enum/marital-status.enum';
import { IsEnum, IsJSON, IsString, Validate } from 'class-validator';

export class CreateEmployeeInformationDto {
  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(MaritalStatus)
  maritalStatus: MaritalStatus;

  @IsString()
  userId: string;

  @IsString()
  dateOfBirth: Date;

  @IsString()
  joinedDate: Date;

  @IsString()
  nationalityID: string;

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

  @IsString()
  roleId: string;

  @IsString()
  tenantId: string;
}
