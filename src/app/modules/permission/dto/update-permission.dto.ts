import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
}
