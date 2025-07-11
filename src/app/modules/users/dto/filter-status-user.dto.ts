import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from '@root/src/core/enum/gender.enum';

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
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(Gender)
  gender?: Gender;
  @IsOptional()
  @IsString()
  joinedDateAfter?: string;
  @IsOptional()
  @IsString()
  joinedDateBefore?: string;
}
