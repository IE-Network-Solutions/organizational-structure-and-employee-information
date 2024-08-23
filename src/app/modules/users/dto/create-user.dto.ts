import { IsEmail, IsOptional, IsString, Validate } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName?: string;

  @IsString()
  middleName?: string;

  @IsString()
  lastName?: string;

  // @IsString()
  @IsOptional()
  profileImage?: any;

  @IsOptional()
  @IsString()
  profileImageDownload?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  roleId?: string;

  // @IsOptional()
  // @IsString()
  // role?: string;
}
