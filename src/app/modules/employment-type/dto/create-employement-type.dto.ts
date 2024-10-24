import { IsEmail, IsOptional, IsString, Validate } from 'class-validator';

export class CreateEmployementTypeDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  description: string;
}
