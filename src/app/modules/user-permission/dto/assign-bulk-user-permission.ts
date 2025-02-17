// create-role-permission.dto.ts
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserPermissionBulkDto {
  @IsArray()
  @IsNotEmpty()
  userId: string[];

  @IsArray()
  @IsNotEmpty()
  permissionId: string[];
}
