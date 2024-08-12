import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DayOfWeek } from '../enum/work-schedule-dayofweek.enum';

export class CreateWorkScheduleDetailDto {
  @IsString()
  id: string;
  @IsOptional()
  @IsString()
  dayOfWeek?: DayOfWeek;
  @IsOptional()
  @IsString()
  startTime?: string;
  @IsOptional()
  @IsString()
  endTime?: string;
  @IsOptional()
  @IsNumber()
  hours?: number;
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
