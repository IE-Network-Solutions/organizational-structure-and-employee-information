// create-role-permission.dto.ts
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRolePermissionDto {
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  permissionId: string[];
}
