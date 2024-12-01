import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ExecutionStatus } from '../enum/execution-status.enum';

export class CreateCronJobLogDto {
  @IsDate()
  executionDate: Date;

  @IsUUID()
  tenantId: string;

  @IsEnum(ExecutionStatus)
  status: ExecutionStatus;

  @IsString()
  @IsOptional()
  message?: string;
}
