import { PartialType } from '@nestjs/mapped-types';
import { CreateOffboardingTasksTemplateDto } from './create-offboarding-tasks-template.dto';

export class UpdateOffboardingTasksTemplateDto extends PartialType(CreateOffboardingTasksTemplateDto)
{ }
