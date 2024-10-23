import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { PermissionGroup } from '../../permission-group/entities/permission-group.entity';
import { RolePermission } from '../../role-permission/entities/role-permission.entity';
import { UserPermission } from '../../user-permission/entities/user-permission.entity';

@Entity()
export class Permission extends BaseModel {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  permissionGroupId: string;

  @ManyToOne(
    () => PermissionGroup,
    (permissionGroup) => permissionGroup.permission,
  )
  permissionGroup: PermissionGroup;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permissions,
  )
  rolePermissions: RolePermission[];

  @OneToMany(
    () => UserPermission,
    (userPermissions) => userPermissions.permission,
  )
  userPermissions: UserPermission[];
}
