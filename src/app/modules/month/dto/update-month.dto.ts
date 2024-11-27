import { PartialType } from '@nestjs/mapped-types';
import { CreateMonthDto } from './create-month.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMonthDto extends PartialType(CreateMonthDto) {
    @IsOptional()
    @IsString()
    id?:string
}
