import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { Permission } from '../../permission/entities/permission.entity';

@Entity()
export class PermissionGroup extends BaseModel {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  tenantId: string;

  @ManyToMany(() => Permission, (permissions) => permissions.permissionGroups, {
    cascade: true,
  })
  @JoinTable({
    name: 'permission_group_permissions',
    joinColumn: { name: 'permissionGroupId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}
