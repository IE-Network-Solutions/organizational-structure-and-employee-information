import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateDepartmentChildDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  branchId?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateDepartmentChildDto)
  department: CreateDepartmentChildDto[];
}
