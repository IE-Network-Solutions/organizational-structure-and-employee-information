import { IsOptional, IsString } from 'class-validator';

export class FilterUsertDto {
  @IsOptional()
  @IsString()
  searchString?: string;
}
