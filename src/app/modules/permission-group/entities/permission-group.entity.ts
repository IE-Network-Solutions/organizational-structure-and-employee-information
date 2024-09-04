import { Entity, Column, OneToMany } from 'typeorm';
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

  @OneToMany(() => Permission, (permissions) => permissions.permissionGroup)
  permission: Permission[];
}
