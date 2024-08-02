import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { Permission } from '../../permission/entities/permission.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class UserPermission extends BaseModel {
  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  permissionId: string;

  @Column({ nullable: true })
  tenantId: string;

  @Column({ nullable: true })
  deligationId: string;

  @ManyToOne(() => User, (user) => user.userPermissions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Permission, (permission) => permission.userPermissions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  permission: Permission;
}
