// create-role-permission.dto.ts
import { IsArray, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

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
