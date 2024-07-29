// create-role-permission.dto.ts
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserPermissionDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  permissionId: string[];
}
