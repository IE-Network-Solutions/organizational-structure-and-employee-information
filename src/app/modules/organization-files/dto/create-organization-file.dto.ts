import { ArrayNotEmpty, IsArray, IsString, IsUUID } from 'class-validator';

export class CreateOrganizationFileDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  files: string[];

  @IsUUID()
  tenantId: string;
}
