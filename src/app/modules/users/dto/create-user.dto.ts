import { IsEmail, IsOptional, IsString, Validate } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  middleName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  profileImage: string;

  @IsString()
  @IsOptional()
  profileImageDownload: string;

  @IsEmail()
  email: string;

  @IsString()
  roleId?: string;

  @IsString()
  @IsOptional()
  tenantId?: string;
}
