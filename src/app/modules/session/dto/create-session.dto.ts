import { IsBoolean, isDateString, IsDateString, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateSessionDto {
    @IsString()
    name: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsUUID()
    calendarId: string;
  
    @IsDateString()
    startDate: Date;
  
    @IsDateString()
    endDate: Date;
  
    @IsBoolean()
    active: boolean;

}
