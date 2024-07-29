import { IsEmail, IsString, Validate } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  middleName: string;

  @IsString()
  lastName: string;

  @IsString()
  profileImage: string;

  @IsEmail()
  email: string;

  @IsString()
  roleId?: string;

  @IsString()
  tenantnId?: string;
}
