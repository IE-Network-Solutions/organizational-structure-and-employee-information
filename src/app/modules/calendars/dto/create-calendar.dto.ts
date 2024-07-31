import {
    IsArray,
    IsBoolean,
    IsDate,
    IsDateString,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { CreateClosedDatesDto } from './create-closed-dates.dto';
import { Type } from 'class-transformer';
export class CreateCalendarDto {
    @IsString()
    name: string;
    @IsDateString()
    @IsOptional()
    startDate: Date;
    @IsDateString()
    @IsOptional()
    endDate: Date;
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateClosedDatesDto)
    closedDates?: CreateClosedDatesDto[];
    @IsString()
    description: string;
}
