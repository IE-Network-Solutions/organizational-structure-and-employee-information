import { IsOptional, IsString } from 'class-validator';

export class CreateNationalityDto {
  @IsOptional()
  @IsString()
  name: string;
}
