import { IsArray, IsNumber, IsString } from 'class-validator';
import { DayOfWeek } from '../enum/work-schedule-dayofweek.enum';

export class CreateWorkScheduleDetailDto {
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
}
