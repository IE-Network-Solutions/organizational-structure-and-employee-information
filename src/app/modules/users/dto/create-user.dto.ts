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

  @IsOptional()
  @IsString()
  profileImageDownload: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  roleId?: string;
}
