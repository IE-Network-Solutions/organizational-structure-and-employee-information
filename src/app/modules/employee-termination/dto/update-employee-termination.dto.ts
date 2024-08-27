import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeTerminationDto } from './create-employee-termination.dto';

export class UpdateEmployeeTerminationDto extends PartialType(CreateEmployeeTerminationDto) {
    
}
