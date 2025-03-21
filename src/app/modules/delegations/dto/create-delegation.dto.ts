import {
  IsUUID,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsString,
} from 'class-validator';

export class CreateDelegationDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  leaveTypeId: string;

  @IsUUID()
  delegatorId: string;
  @IsUUID()
  leaveRequestId: string;

  @IsUUID()
  delegateeId: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsString()
  @IsOptional()
  reason?: string;
}
