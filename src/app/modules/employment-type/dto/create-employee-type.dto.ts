import { IsEmail, IsString, Validate } from 'class-validator';

export class CreateEmployeeTypeDto {
  @IsString()
  name: string;

  @IsString()
  tenantId?: string;
}
