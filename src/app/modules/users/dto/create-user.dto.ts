import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

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
  domainUrl?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  roleId?: string;
}
