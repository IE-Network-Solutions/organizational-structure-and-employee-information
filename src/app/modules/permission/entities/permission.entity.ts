// import { BaseModel } from 'src/database/base.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { PermissionGroup } from '../../permission-group/entities/permission-group.entity';
import { RolePermission } from '../../role-permission/entities/role-permission.entity';
import { UserPermission } from '../../user-permission/entities/user-permission.entity';
/** This is a TypeScript class representing a Permission entity with an id and a unique name and slug columns. */
@Entity()
export class Permission extends BaseModel {
  @Column()
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
    { onDelete: 'SET NULL', onUpdate: 'CASCADE' },
  )
  permissionGroup: PermissionGroup;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permissions,
    { onDelete: 'SET NULL', onUpdate: 'CASCADE' },
  )
  rolePermissions: RolePermission[];

  @OneToMany(
    () => UserPermission,
    (userPermissions) => userPermissions.permission,
    { onDelete: 'SET NULL', onUpdate: 'CASCADE' },
  )
  userPermissions: UserPermission[];
}
