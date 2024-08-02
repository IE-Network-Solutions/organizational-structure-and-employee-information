import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateDepartmentChildDto } from './create-department-child.dto';

export class CreateDepartmentDto {
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
