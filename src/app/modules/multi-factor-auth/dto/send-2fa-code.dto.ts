import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class Send2FACodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  pass: string;

  @IsString()
  @IsNotEmpty()
  recaptchaToken: string;

  @IsString()
  @IsNotEmpty()
  loginTenantId: string;
}
