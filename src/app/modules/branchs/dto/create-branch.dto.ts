import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  location: string;
  @IsOptional()
  @IsString()
  contactNumber?: string;
  @IsOptional()
  @IsEmail()
  contactEmail?: string;
}
