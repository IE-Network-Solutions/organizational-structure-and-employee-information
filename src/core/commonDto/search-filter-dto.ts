import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchFilterDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  columnName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  query?: string;
}
