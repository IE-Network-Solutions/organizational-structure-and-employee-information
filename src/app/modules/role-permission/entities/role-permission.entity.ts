import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { Role } from '../../role/entities/role.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity()
export class RolePermission extends BaseModel {
  @Column({ nullable: true })
  roleId: string;

  @Column({ nullable: true })
  permissionId: string;

  @Column({ nullable: true })
  tenantId: string;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => Permission, (permissions) => permissions.rolePermissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'permissionId' })
  permissions: Permission;
}
