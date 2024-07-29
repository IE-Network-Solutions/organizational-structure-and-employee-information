// create-role-permission.dto.ts
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRolePermissionDto {
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  permissionId: string[];
}
