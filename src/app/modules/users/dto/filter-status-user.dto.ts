import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FilterStatusDto {
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
