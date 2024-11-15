import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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
