import { IsDateString, IsOptional, IsString } from 'class-validator';
export class CreateClosedDatesDto {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsDateString()
  date: Date;
  @IsString()
  type: string;
  @IsOptional()
  @IsString()
  description?: string;
}
