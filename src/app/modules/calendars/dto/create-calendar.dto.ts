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
import { CreateSessionDto } from '../../session/dto/create-session.dto';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionDto)
  sessions?: CreateSessionDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
