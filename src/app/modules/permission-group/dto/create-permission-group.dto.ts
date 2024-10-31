import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
