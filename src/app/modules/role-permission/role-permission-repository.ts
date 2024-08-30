import { RolePermission } from './entities/role-permission.entity';

import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(RolePermission)
export class RolePermissionRepository extends Repository<RolePermission> {}
