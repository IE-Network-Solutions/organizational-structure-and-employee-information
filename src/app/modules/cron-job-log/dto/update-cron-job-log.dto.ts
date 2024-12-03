import { PartialType } from '@nestjs/mapped-types';
import { CreateCronJobLogDto } from './create-cron-job-log.dto';

export class UpdateCronJobLogDto extends PartialType(CreateCronJobLogDto) {}
