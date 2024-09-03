import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { CreateWorkScheduleDetailDto } from './create-work-schedule-detail.dto';

export class CreateWorkScheduleDto {
  @IsString()
  name: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkScheduleDetailDto)
  detail: CreateWorkScheduleDetailDto[];
}
