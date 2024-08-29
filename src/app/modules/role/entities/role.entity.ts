// import { BaseModel } from 'src/database/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { RolePermission } from '../../role-permission/entities/role-permission.entity';
import { User } from '../../users/entities/user.entity';
@Entity()
export class Role extends BaseModel {
  @Column()
  name: string;
  @Column({ nullable: true })// unique: true
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  tenantId: string;

  @OneToMany(() => User, (user) => user.role)
  user: User[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  rolePermissions: RolePermission[];
}
