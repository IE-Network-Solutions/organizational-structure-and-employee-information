import { IsEmail, IsString } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  location: string;
  @IsString()
  contactNumber: string;
  @IsEmail()
  contactEmail: string;
}
