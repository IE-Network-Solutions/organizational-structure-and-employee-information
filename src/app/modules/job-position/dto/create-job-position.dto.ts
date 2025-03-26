import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';




export class CreateJobPositionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
 @IsOptional()
  description?: string;

}
