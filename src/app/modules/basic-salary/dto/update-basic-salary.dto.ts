import { PartialType } from '@nestjs/swagger';
import { CreateBasicSalaryDto } from './create-basic-salary.dto';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBasicSalaryDto extends PartialType(CreateBasicSalaryDto) {
  @IsOptional()
  @IsNumber()
  basicSalary?: number;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  jobInfoId?: string;
}
