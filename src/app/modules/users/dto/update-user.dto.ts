import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permission: string[];
  @IsOptional()
  @IsBoolean()
  hasChangedPassword?:boolean
}
