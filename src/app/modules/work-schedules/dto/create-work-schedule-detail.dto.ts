import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { DayOfWeek } from '../enum/work-schedule-dayofweek.enum';

export class CreateWorkScheduleDetailDto {
    @IsString()
    id: string
    @IsString()
    dayOfWeek: DayOfWeek;
    @IsString()
    startTime: string;
    @IsString()
    breakStartTime: string;
    @IsString()
    breakEndTime: string;
    @IsString()
    endTime: string;
    @IsNumber()
    hours: number;
    @IsBoolean()
    status: boolean;
}
