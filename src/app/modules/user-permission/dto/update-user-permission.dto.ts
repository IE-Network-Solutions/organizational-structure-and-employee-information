import { PartialType } from '@nestjs/mapped-types';
import { CreateUserPermissionDto } from './create-user-permission.dto';

export class UpdateRolePermissionDto extends PartialType(
  CreateUserPermissionDto,
) {}
