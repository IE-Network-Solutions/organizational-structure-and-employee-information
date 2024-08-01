import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployementTypeDto } from './create-employement-type.dto';

export class UpdateEmployementTypeDto extends PartialType(CreateEmployementTypeDto) { }
