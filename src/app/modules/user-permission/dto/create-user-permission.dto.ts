// create-role-permission.dto.ts
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserPermissionDto {
  @IsOptional()
  @IsNotEmpty()
  userId?: string;

  @IsArray()
  @IsNotEmpty()
  permissionId: string[];

  @IsOptional()
  @IsNotEmpty()
  deligationId: string;
}
