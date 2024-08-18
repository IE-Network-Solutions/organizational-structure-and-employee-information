import { PartialType } from '@nestjs/mapped-types';
import { CreateNationalityDto } from './create-nationality.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNationalityDto extends PartialType(CreateNationalityDto) {}
