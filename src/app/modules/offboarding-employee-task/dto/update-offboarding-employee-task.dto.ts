import { PartialType } from '@nestjs/mapped-types';
import { CreateOffboardingEmployeeTaskDto } from './create-offboarding-employee-task.dto';

export class UpdateOffboardingEmployeeTaskDto extends PartialType(CreateOffboardingEmployeeTaskDto) { }
