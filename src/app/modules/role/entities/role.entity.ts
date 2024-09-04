import { Entity, Column, OneToMany, Unique } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { RolePermission } from '../../role-permission/entities/role-permission.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@Unique(['slug', 'tenantId'])
export class Role extends BaseModel {
  @Column()
  name: string;

  @Column({ type: 'varchar' })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  tenantId: string;

  @OneToMany(() => User, (user) => user.role)
  user: User[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
