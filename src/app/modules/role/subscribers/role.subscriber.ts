import {
  EventSubscriber,
  EntitySubscriberInterface,
  SoftRemoveEvent,
} from 'typeorm';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { User } from '../../users/entities/user.entity';

@EventSubscriber()
@Injectable()
export class RoleSubscriber implements EntitySubscriberInterface<Role> {
  listenTo() {
    return Role;
  }
  async afterRoleSoftRemoveFromUser(event: SoftRemoveEvent<Role>) {
    const userRepository: Repository<User> =
      event.connection.getRepository(User);
    if (event.entity.deletedAt) {
      await userRepository.update(
        { roleId: event.entity.id },
        { roleId: null },
      );
    }
  }
}
