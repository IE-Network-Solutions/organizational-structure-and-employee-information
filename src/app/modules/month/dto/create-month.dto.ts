import { IsBoolean, IsDate, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateMonthDto {
    @IsString()
    name: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsUUID()
    sessionId: string;
  
    @IsDate()
    startDate: Date;
  
    @IsDate()
    endDate: Date;
  
    @IsBoolean()
    @IsOptional()
    active?: boolean
}
