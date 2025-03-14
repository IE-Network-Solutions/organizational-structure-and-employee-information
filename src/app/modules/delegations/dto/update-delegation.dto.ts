import { PartialType } from '@nestjs/mapped-types';

import { IsOptional, IsString } from 'class-validator';
import { CreateDelegationDto } from './create-delegation.dto';

export class UpdateDelegationDto extends PartialType(CreateDelegationDto) {
  @IsOptional()
  @IsString()
  id: string;
}
