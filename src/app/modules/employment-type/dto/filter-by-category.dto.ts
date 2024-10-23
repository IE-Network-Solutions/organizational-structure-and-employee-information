import { IsOptional, IsString } from 'class-validator';

export class EmploymentStatusFilterDto {
  @IsOptional()
  @IsString()
  type?: string;
}
