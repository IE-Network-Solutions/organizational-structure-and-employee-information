import { IsDateString, IsString } from 'class-validator';
export class CreateClosedDatesDto {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsDateString()
  date: Date;
  @IsString()
  type: string;
  @IsString()
  description: string;
}
