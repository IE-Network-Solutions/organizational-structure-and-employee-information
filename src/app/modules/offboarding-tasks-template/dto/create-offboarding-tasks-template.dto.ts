import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOffboardingTasksTemplateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  approverId: string;

  @IsUUID()
  @IsOptional()
  tenantId?: string;
}
