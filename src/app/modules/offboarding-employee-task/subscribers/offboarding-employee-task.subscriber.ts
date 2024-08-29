import {
  EventSubscriber,
  EntitySubscriberInterface,
  SoftRemoveEvent,
} from 'typeorm';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { OffboardingEmployeeTask } from '../entities/offboarding-employee-task.entity';
import { User } from '../../users/entities/user.entity';

@EventSubscriber()
@Injectable()
export class OffboardingEmployeeTasksSubscriber
  implements EntitySubscriberInterface<OffboardingEmployeeTask> {
  listenTo() {
    return OffboardingEmployeeTask;
  }

  async afterSoftRemove(event: SoftRemoveEvent<OffboardingEmployeeTask>) {
    const userRepository: Repository<User> =
      event.connection.getRepository(User);
    if (event.entity.deletedAt) {
      await userRepository.update(
        { id: event.entity.approverId },
        { roleId: null },
      );
    }
  }
}
