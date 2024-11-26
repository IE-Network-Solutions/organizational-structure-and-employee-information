import { Type } from "class-transformer";
import { IsBoolean, isDateString, IsDateString, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateMonthDto } from "../../month/dto/create-month.dto";

export class CreateSessionDto {
    @IsString()
    name: string;
  
    @IsString()
    @IsOptional()
    description?: string;
    @IsOptional()
    @IsUUID()
    calendarId?: string;
  
    @IsDateString()
    startDate: Date;
  
    @IsDateString()
    endDate: Date;
  
    @IsBoolean()
    active: boolean;
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateMonthDto)
    months?: CreateMonthDto[];

}
