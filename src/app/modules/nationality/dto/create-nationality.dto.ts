import { IsEmail, IsString, Validate } from 'class-validator';

export class CreateNationalityDto {
  @IsString()
  name: string;
}
