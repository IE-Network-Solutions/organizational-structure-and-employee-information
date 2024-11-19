import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BranchRequestStatus } from '../enum/Branch-request-status.enum';

export class CreateBranchRequestDto {
  @IsNotEmpty()
  @IsString()
  userId: string; // Representing the user relationship by user ID

  @IsNotEmpty()
  @IsString()
  currentBranchId: string;

  @IsNotEmpty()
  @IsString()
  requestBranchId: string;

  @ApiPropertyOptional({
    enum: BranchRequestStatus,
    example: BranchRequestStatus.PENDING,
  })
  @IsEnum(BranchRequestStatus)
  @IsOptional()
  status: BranchRequestStatus | null = null;

  @IsOptional()
  @IsString()
  approvalType?: string;

  @IsOptional()
  @IsString()
  approvalWorkflowId?: string;

  @IsOptional()
  @IsUUID()
  tenantId?: string;
}
