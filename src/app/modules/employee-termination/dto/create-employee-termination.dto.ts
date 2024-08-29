import { EligibleForRehire } from '@root/src/core/enum/eligible-for-hire.enum';
import { TerminationType } from '@root/src/core/enum/termination-type.dto';
import { IsOptional, IsString } from 'class-validator';

export class CreateEmployeeTerminationDto {
  @IsString()
  reason: string;

  @IsString()
  type: TerminationType;

  @IsString()
  eligibleForRehire: EligibleForRehire;

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
