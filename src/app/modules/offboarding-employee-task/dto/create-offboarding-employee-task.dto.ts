import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOffboardingEmployeeTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted: boolean;

  @IsOptional()
  @IsDateString()
  completedDate: Date;

  @IsOptional()
  tenantId: string;

  @IsOptional()
  employeTerminationId: string;

  @IsOptional()
  approverId: string;
}
