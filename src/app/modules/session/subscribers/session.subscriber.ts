import { Injectable } from '@nestjs/common';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  Repository,
  SoftRemoveEvent,
} from 'typeorm';
import { Month } from '../../month/entities/month.entity';
import { Session } from '../entities/session.entity';

@EventSubscriber()
@Injectable()
export class SessionSubscriber implements EntitySubscriberInterface<Session> {
  listenTo() {
    return Session;
  }
  async afterSoftRemove(event: SoftRemoveEvent<Session>) {
    const monthRepository: Repository<Month> =
      event.connection.getRepository(Month);

    if (event.entity.deletedAt) {
      const months = await monthRepository.find({
        where: { sessionId: event.entity.id },
      });
      for (const month of months) {
        await monthRepository.softRemove(month);
      }
    }
  }
}
