import {
  EventSubscriber,
  EntitySubscriberInterface,
  SoftRemoveEvent,
} from 'typeorm';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { PermissionGroup } from '../entities/permission-group.entity';
import { Permission } from '../../permission/entities/permission.entity';

@EventSubscriber()
@Injectable()
export class PermissionGroupSubscriber implements EntitySubscriberInterface<PermissionGroup> {
  listenTo() {
    return PermissionGroup;
  }
  async afterPermissionGroupFromPermissionSoftRemove(event: SoftRemoveEvent<PermissionGroup>) {
    const permissionRepository: Repository<Permission> =
      event.connection.getRepository(Permission);
    if (event.entity.deletedAt) {
      await permissionRepository.update(
        { permissionGroupId: event.entity.id },
        { permissionGroupId: null },
      );
    }
  }
}
