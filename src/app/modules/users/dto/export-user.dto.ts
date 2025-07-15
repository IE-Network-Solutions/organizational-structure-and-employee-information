import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum DownloadFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
}

export enum JoinedDateType {
  AFTER = 'after',
  BEFORE = 'before',
}

export class ExportUserDto {
  @IsOptional()
  @IsString()
  employee_name?: string;

  @IsOptional()
  @IsString()
  allOffices?: string;

  @IsOptional()
  @IsString()
  allJobs?: string;

  @IsOptional()
  @IsString()
  allStatus?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  joinedDate?: string;

  @IsOptional()
  @IsEnum(JoinedDateType)
  joinedDateType?: JoinedDateType;

  //   @IsEnum(DownloadFormat)
  downloadFormat: any;
}
