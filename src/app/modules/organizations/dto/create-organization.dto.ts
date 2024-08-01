import { IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsOptional()
  workScheduleId?: string;
  @IsOptional()
  @IsString()
  calendarId?: string;
}
