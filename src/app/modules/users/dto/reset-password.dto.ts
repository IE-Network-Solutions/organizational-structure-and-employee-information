import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  url: string;

  @IsString()
  logeInTenantId: string;
}
