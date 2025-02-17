import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './create-department.dto';
import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateDepartmentChildDto } from './update-department-child.dto';

export class DissolveDepartmentDto {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsString()
  branchId: string;
  @IsOptional()
  @IsUUID()
  teamLeader?: string;

  @IsArray()
  @IsString({ each: true })
  departmentToDelete: string[];

  @ValidateNested({ each: true })
  @Type(() => UpdateDepartmentChildDto)
  department: UpdateDepartmentChildDto[];
}
