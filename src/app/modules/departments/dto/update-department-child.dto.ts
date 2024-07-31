import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateDepartmentChildDto {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsString()
  branchId: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateDepartmentChildDto)
  department: UpdateDepartmentChildDto[];
}
