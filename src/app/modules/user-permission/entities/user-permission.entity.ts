import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { Permission } from '../../permission/entities/permission.entity';

@Entity()
export class UserPermission extends BaseModel {
  // @ManyToOne(() => User, (user) => user.userPermissions, {
  //   onDelete: 'SET NULL',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn({ name: 'userId' })
  // user: User;

  // @ManyToOne(() => Permission, (permission) => permission.userPermissions, {
  //   onDelete: 'SET NULL',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn({ name: 'permissionId' })
  // permission: Permission;
}
