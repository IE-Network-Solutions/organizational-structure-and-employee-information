import { PartialType } from '@nestjs/mapped-types';
import { CreateCalendarDto } from './create-calendar.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCalendarDto extends PartialType(CreateCalendarDto) {
    @IsOptional()
    @IsString()
    id:string
}
