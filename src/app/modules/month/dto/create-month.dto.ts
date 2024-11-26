import { IsBoolean, IsDate, IsDateString, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateMonthDto {

    @IsString()
    name: string;
  
    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    @IsUUID()
    sessionId?: string;
    
    @IsDateString()
    startDate: Date;
  
    @IsDate()
    endDate: Date;
  
    @IsBoolean()
    @IsOptional()
    active?: boolean
    
}
