
import { EntityRepository, Repository } from 'typeorm';
import { UserPermission } from './entities/user-permission.entity';

@EntityRepository(UserPermission)
export class UserPermissionRepository extends Repository<UserPermission> {}
