import { eligibleForRehire } from '@root/src/core/enum/eligible-for-hire.enum';
import { terminationType } from '@root/src/core/enum/termination-type.dto';
import { IsOptional, IsString } from 'class-validator';

export class CreateEmployeeTerminationDto {
  @IsString()
  reason: string;

  @IsString()
  type: terminationType;

  @IsString()
  eligibleForRehire: eligibleForRehire;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  effectiveDate?: Date;

  @IsString()
  jobInformationId: string;

  @IsString()
  userId: string;
}

