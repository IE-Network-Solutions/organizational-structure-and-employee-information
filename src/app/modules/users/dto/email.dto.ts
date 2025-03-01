import { IsOptional, IsString } from 'class-validator';

export class FilterEmailDto {
  @IsOptional()
  @IsString()
  email?: string;
}
