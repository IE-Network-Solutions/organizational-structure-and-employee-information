import {
  EventSubscriber,
  EntitySubscriberInterface,
  SoftRemoveEvent,
} from 'typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Organization } from '../../organizations/entities/organization.entity';
import { Injectable } from '@nestjs/common';
import { WorkSchedule } from '../entities/work-schedule.entity';

@EventSubscriber()
@Injectable()
export class WorkScheduleSubscriber
  implements EntitySubscriberInterface<WorkSchedule>
{
  listenTo() {
    return WorkSchedule;
  }
  async afterSoftRemove(event: SoftRemoveEvent<WorkSchedule>) {
    const organizationRepository: Repository<Organization> =
      event.connection.getRepository(Organization);
    if (event.entity.deletedAt) {
      await organizationRepository.update(
        { workScheduleId: event.entity.id },
        { workScheduleId: null },
      );
    }
  }
}
