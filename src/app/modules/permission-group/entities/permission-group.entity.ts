// import { BaseModel } from 'src/database/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { Permission } from '../../permission/entities/permission.entity';

@Entity()
export class PermissionGroup extends BaseModel {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  tenantId: string;

  @OneToMany(() => Permission, (permissions) => permissions.permissionGroup, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  permission: Permission[];
}
