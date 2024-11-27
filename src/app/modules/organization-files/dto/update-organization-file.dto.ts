import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationFileDto } from './create-organization-file.dto';

export class UpdateOrganizationFileDto extends PartialType(
  CreateOrganizationFileDto,
) {}
