import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBasicSalaryDto {
  @IsNumber()
  @IsNotEmpty()
  basicSalary: number;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsString()
  userId: string;

  @IsString()
  jobInfoId: string;
}
