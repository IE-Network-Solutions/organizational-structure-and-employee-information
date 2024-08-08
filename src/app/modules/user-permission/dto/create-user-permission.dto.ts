// create-role-permission.dto.ts
import { IsArray, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateUserPermissionDto {
  @IsUUID()
  @IsOptional()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  permissionId: string[];

  @IsUUID()
  @IsOptional()
  @IsNotEmpty()
  deligationId: string;
}
