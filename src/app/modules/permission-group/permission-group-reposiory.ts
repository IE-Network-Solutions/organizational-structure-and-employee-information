
import { EntityRepository, Repository } from 'typeorm';
import { PermissionGroup } from './entities/permission-group.entity';

@EntityRepository(PermissionGroup)
export class PermissionGroupRepository extends Repository<PermissionGroup> {}
