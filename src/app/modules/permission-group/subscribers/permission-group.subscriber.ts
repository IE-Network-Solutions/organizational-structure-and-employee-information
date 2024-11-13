import {
  EventSubscriber,
  EntitySubscriberInterface,
  SoftRemoveEvent,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PermissionGroup } from '../entities/permission-group.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { Repository } from 'typeorm';

@EventSubscriber()
@Injectable()
export class PermissionGroupSubscriber
  implements EntitySubscriberInterface<PermissionGroup>
{
  listenTo() {
    return PermissionGroup;
  }

  async afterSoftRemove(event: SoftRemoveEvent<PermissionGroup>) {
    const permissionRepository: Repository<Permission> =
      event.manager.getRepository(Permission);

    if (event.entity?.deletedAt) {
      await permissionRepository
        .createQueryBuilder()
        .relation(Permission, 'permissionGroups')
        .of(event.entity.id) // the soft-deleted group ID
        .remove(event.entity); // Remove this PermissionGroup from all associated Permissions
    }
  }
}
