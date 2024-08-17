import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FilterDto {
  @IsOptional()
  deletedAt?: any;
  @IsOptional()
  @IsString()
  departmentId?: string;
  @IsOptional()
  @IsString()
  branchId?: string;
  @IsOptional()
  @IsString()
  searchString?: string;
}
