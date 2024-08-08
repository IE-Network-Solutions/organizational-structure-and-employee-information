import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permission: string[];

  @IsString()
  @IsOptional()
  tenantId: string;
}
