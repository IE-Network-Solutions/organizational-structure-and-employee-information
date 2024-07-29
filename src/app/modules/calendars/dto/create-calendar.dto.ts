import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateCalendarDto {
  @IsString()
  name: string;
  @IsDateString()
  @IsOptional()
  startDate: Date;
  @IsDateString()
  @IsOptional()
  endDate: Date;
  @IsArray()
  closedDates: [];
  @IsString()
  description: string;
}
