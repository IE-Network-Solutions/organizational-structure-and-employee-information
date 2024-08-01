import {
  EventSubscriber,
  EntitySubscriberInterface,
  SoftRemoveEvent,
} from 'typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Calendar } from '../entities/calendar.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { Injectable } from '@nestjs/common';

@EventSubscriber()
@Injectable()
export class CalendarSubscriber implements EntitySubscriberInterface<Calendar> {
  listenTo() {
    return Calendar;
  }
  async afterSoftRemove(event: SoftRemoveEvent<Calendar>) {
    const organizationRepository: Repository<Organization> =
      event.connection.getRepository(Organization);
    if (event.entity.deletedAt) {
      await organizationRepository.update(
        { calendarId: event.entity.id },
        { calendarId: null },
      );
    }
  }
}
