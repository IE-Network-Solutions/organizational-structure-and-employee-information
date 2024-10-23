import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // @Column({ type: 'varchar', unique: true })
  // slug: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permission?: string[];

  @IsString()
  @IsOptional()
  tenantId: string;
}
