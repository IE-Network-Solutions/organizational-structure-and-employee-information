import { IsEmail, IsOptional, IsString } from 'class-validator';
export class CreateEmailDto {
  @IsOptional()
  @IsEmail()
  from: string;
  @IsOptional()
  @IsEmail()
  replyTo: string;
  @IsEmail()
  to: string;
  @IsString()
  subject: string;
  @IsString()
  html: string;
}
